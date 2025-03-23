# nbu_exchange_rate

## How it works

In cloudflare we have dedicated [nbu_exchange_rate](https://dash.cloudflare.com/f09bf7b4ddbc71a3a07f7ffb5638163b/workers/services/view/nbu_exchange_rate/production) worker where we are deploing our [script](index.js)

## Development

```
npm run dev
open http://localhost:8787
```

## Deployment

Deployments are automated and done behind the scene after merge to main branch

To deploy manually you need two environment variables:

Account identifier pointing to italks cloudflare account

```bash
export CLOUDFLARE_ACCOUNT_ID=f09bf7b4ddbc71a3a07f7ffb5638163b
```

Your token

```bash
export CLOUDFLARE_API_TOKEN=xxxxxxxxxx
```

Token can be created [here](https://dash.cloudflare.com/profile/api-tokens), use "Edit Cloudflare Workers" template, it has all required permissions

Both environment variables are added as secrets to github, for automated deployments

In case if you already have tokens for other accounts just save them to another wariable and do soemthing like this:

```bash
export CLOUDFLARE_ACCOUNT_ID=$ITALKS_CLOUDFLARE_ACCOUNT_ID
export CLOUDFLARE_API_TOKEN=$ITALKS_CLOUDFLARE_API_TOKEN
npm run deploy
```

To verify if token is still valid use:

```bash
curl "https://api.cloudflare.com/client/v4/user/tokens/verify" \
--header "Authorization: Bearer $ITALKS_CLOUDFLARE_API_TOKEN"
```

> Note: domain name can not contain underscores, if you receive: `An unknown error has occurred. If this error persists, please file a report in workers-sdk or reach out to your account team. [code: 10013]` there is a chance you are trying to deploy to `foo_bar.italks.com.ua` which is not valid and should be `foo-bar.italks.com.ua`

## Smoke Test

```bash
curl -s -i 'https://nbu-exchange-rate.italks.com.ua/NBUStatService/v1/statdirectory/exchange?valcode=EUR&date=20241003&json'
```
