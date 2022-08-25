import robin_stocks
import json, hmac, hashlib, time, requests, base64
from requests.auth import AuthBase
from endpoints import Controller
#pip install endpoints
#pip install requests
#pip install robin_stocks

class CoinbaseExchangeAuth(AuthBase):
    def __init__(self, api_key, secret_key, passphrase):
        self.api_key = api_key
        self.secret_key = secret_key
        self.passphrase = passphrase

    def __call__(self, request):
        timestamp = str(int(time.time()))
        message = timestamp + request.method + request.path_url + (request.body or b'').decode()
        hmac_key = base64.b64decode(self.secret_key)
        signature = hmac.new(hmac_key, message.encode(), hashlib.sha256)
        signature_b64 = base64.b64encode(signature.digest()).decode()

        request.headers.update({
            'CB-ACCESS-SIGN': signature_b64,
            'CB-ACCESS-TIMESTAMP': timestamp,
            'CB-ACCESS-KEY': self.api_key,
            'CB-ACCESS-PASSPHRASE': self.passphrase,
            'Content-Type': 'application/json'
        })
        return request

with open('config.txt') as json_file:
    data = json.load(json_file)
    for cred in data["coinbasepro"]:
        coinbaseProAPIKey = cred["apikey"]
        coinbaseProSecretKey = cred["secretkey"]
        coinbaseProPassKey = cred["passkey"]
    for cred in data["robinhood"]:
        robinhoodUsername = cred["username"]
        robinhoodPassword = cred["password"]

cbPro_api_url = 'https://api.pro.coinbase.com/'
auth = CoinbaseExchangeAuth(coinbaseProAPIKey, coinbaseProSecretKey, coinbaseProPassKey)



class Robinhood(Controller):
    def GET(self):
        return getRobinhood()

class Coinbasepro(Controller):
    def GET(self):
        return getCoinbasePro()

def getCoinbasePro():
    response = requests.get(cbPro_api_url + 'accounts', auth=auth)
    if(response.status_code != 200):
        print(response.json())
        return response
    assets = {}
    stableCoins = {}
    cash = 0
    totalEquity = 0
    for coin in response.json():
        if((coin['balance'] != '0.0000000000000000') & (coin['currency'] != 'USD')):
            assets[coin['currency']] = {'balance': float(coin['balance'])}
        elif (coin['currency'] in {'USD', 'USDC', 'DAI'}) & (coin['balance'] != '0.0000000000000000'):
            stableCoins[coin['currency']] = float(coin['balance'])
            totalEquity = totalEquity + float(coin['balance'])
    print (stableCoins)
    for product in assets.keys():
        res = requests.get(cbPro_api_url + 'products/' + product + '-USD/ticker')
        lTrade = res.json()
        if 'price' in lTrade.keys():
            assets[product]['price'] = float(lTrade['price'])
            assets[product]['equity'] = float(lTrade['price']) * float(assets[product]['balance'])
            totalEquity = totalEquity + assets[product]['equity']
        else:
            res2 = requests.get(cbPro_api_url + 'products/product' + '-USDC/ticker')
            usdcPair = res2.json()
            if 'price' in usdcPair.keys():
                assets[product]['price'] = float(usdcPair['price'])
                assets[product]['equity'] = float(usdcPair['price']) * float(usdcPair[product]['balance'])
                totalEquity = totalEquity + assets[product]['equity']
            else:
                print(product)
                print('ERROR:  NO USD OR USDC PAIR FOR ASSET')
    shouldBeOne = 0
    for stable in stableCoins.keys():
        cash = cash + stableCoins[stable]
    for coin in assets.keys():
        assets[coin]['allocation'] = (float(assets[coin]['equity'])/totalEquity)
        shouldBeOne = shouldBeOne + assets[coin]['allocation']
    print(shouldBeOne)
    print(assets)
    coinbaseDict = {'assets': assets, 'totalEquity': totalEquity, 'cash': cash}
    print(coinbaseDict)
    return coinbaseDict

def getRobinhood():
    if((robinhoodUsername == "") | (robinhoodPassword == "")):
        return TypeError
    
    robin_stocks.authentication.login(robinhoodUsername, robinhoodPassword)

    portfolio_cash = robin_stocks.profiles.load_account_profile("portfolio_cash")
    portfolio_profile = robin_stocks.profiles.load_portfolio_profile()
    positions = robin_stocks.account.build_holdings()
    
    if portfolio_profile['extended_hours_market_value'] == None:
        marketValue = 'market_value'
        equity = 'equity'
    else:
        marketValue = 'extended_hours_market_value'
        equity = 'extended_hours_equity'

    assets ={}
    for asset in positions.keys():
        assets[asset] = {}
        assets[asset]['price'] = round(float(positions[asset]['price']),2)
        assets[asset]['quantity'] = round(float(positions[asset]['quantity']))
        assets[asset]['average_buy_price'] = round(float(positions[asset]['average_buy_price']),2)
        assets[asset]['equity'] = round(float(positions[asset]['equity']),2)
        assets[asset]['percent_change'] = round(float(positions[asset]['percent_change']),2)
        assets[asset]['equity_change'] = round(float(positions[asset]['equity_change']),2)
        assets[asset]['percentage'] = round(float(positions[asset]['percentage']),2)
        assets[asset]['name'] = positions[asset]['name']
        assets[asset]['type'] = positions[asset]['type']

    robinDict  = {'marketValue': round(float(portfolio_profile[marketValue]),2), 'totalEquity': round(float(portfolio_profile[equity]),2), 'cash': round(float(portfolio_cash),2), 'positions': assets}
    print(robinDict)
    
    return robinDict

def main():
    #response = requests.get(cbPro_api_url + 'accounts', auth=auth)
    #print(response.json())
    getCoinbasePro()
    getRobinhood()

if __name__ == "__main__":
    # execute only if run as a script
    main()