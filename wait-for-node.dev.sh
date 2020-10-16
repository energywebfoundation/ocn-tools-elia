#!/usr/bin/env sh

party=$(echo $1 | sed -e 's/--//g')

curl_opts='--output /dev/null --silent --head --fail'
base_url='http://172.16.238.20:8080'

until $(curl $curl_opts $base_url/health); do
    printf 'waiting for node up\n'
    sleep 5
done

printf 'node is up\n'

data="[{\"party_id\":\"$party\",\"country_code\":\"de\"}]"
echo sending $data
res=$(curl --silent -XPOST $base_url/admin/generate-registration-token -H "Authorization: Token $OCN_NODE_KEY" -H 'Content-Type: application/json' -d $data)

echo "generated token_a $res"

# ensure node is registered
./node_modules/.bin/ocn-registry set-node $base_url -s 0x1c3e5453c0f9aa74a8eb0216310b2b013f017813a648fce364bf41dbc0b37647 &> /dev/null

OCN_TOKEN_A="${res:10:36}" node dist/index.js mock $1
