import { Contract } from "@ethersproject/contracts"
import { keccak256 } from "@ethersproject/keccak256"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Wallet } from "@ethersproject/wallet"
import { Keys } from "@ew-did-registry/keys"
import { config } from "../../config/config"
import abi from "./ev-registry.abi"

export class EvRegistry {

    private readonly contract: Contract
    private readonly subject: Wallet

    constructor(operatorKeys: Keys, subjectKeys?: Keys) {
        if (!config.evRegistry) {
            throw Error("EV Registry contract address not set in config.")
        }
        const provider = new JsonRpcProvider(config.evRegistry?.provider)
        const signer = new Wallet(operatorKeys.privateKey, provider)
        this.contract = new Contract(config.evRegistry.address, abi, signer)
        this.subject = new Wallet(
            subjectKeys ? subjectKeys.privateKey : operatorKeys.privateKey
        )
    }

    /**
     * Check for existence of user
     */
    public async userExists(): Promise<boolean> {
        const user = this.subject.address
        const exists = await this.contract.getAllUserAddresses()
        console.log(`[EV REGISTRY] Checking user ${user} against ${JSON.stringify(exists)}`)
        return exists.includes(user)
    }

    /**
     * Check for existence of device
     */
    public async deviceExists(): Promise<boolean> {
        const device = this.subject.address
        const exists = await this.contract.getAllDeviceAddresses()
        console.log(`[EV REGISTRY] Checking device ${device} against ${JSON.stringify(exists)}`)
        return exists.includes(device)
    }

    /**
     * Adds user (MSP/CPO, represented by wallet) to registry contract 
     */
    public async addUser(): Promise<void> {
        if (await this.userExists()) {
            console.log('SKIPPING ADDUSER...')
            return
        }
        const user = this.subject.address
        const { r, s, v } = await this.getSignature(user)
        console.log("r", r, "s", s, "v", v)
        await this.contract.addUser(user, v, r, s)
    }

    /**
     * Adds asset (vehicle/charge point, represented by wallet) to registry contract
     */
    public async addDevice(uid: string, userAddress: string): Promise<void> {
        if (await this.deviceExists()) {
            console.log('SKIPPING ADDDEVICE')
            return
        }
        const device = this.subject.address
        const { r, v, s } = await this.getSignature(device, uid, userAddress)
        console.log("r", r, "s", s, "v", v)
        await this.contract.addDevice(device, uid, userAddress, v, r, s)
    }

    /**
     * EV Registry contract allows for transaction relaying. We can use the operator to
     * pay for the transaction.
     * @param params arbitrary number of parameters that will be signed
     */
    private async getSignature(...params: any[]): Promise<{ r: string, s: string, v: number }> {
        const hash = keccak256(params.join(""))
        const signature = await this.subject.signMessage(hash)
        return {
            r: `0x${signature.slice(2, 66)}`,
            s: `0x${signature.slice(66, 130)}`,
            v: Number(`0x${signature.slice(130)}`)
        }
    }

} 
