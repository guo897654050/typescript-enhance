abstract class LoginHanlder {
  abstract handler(): void
}

const enum LoginType {
  WX = 'wechat',
  TaoBao = 'taobao',
  TikTok = 'tiktok'
}

class WXLogin implements LoginHanlder {
  handler(): void {
    console.log('wx')
  }
}

class TBLogin implements LoginHanlder {
  handler(): void {
    console.log('tb')
  }
}

class TKLogin implements LoginHanlder {
  handler(): void {
    console.log('tiktok')
  }
}

class Login {
  public static handlerMap: Record<LoginType, LoginHanlder> = {
    [LoginType.WX]: new WXLogin(),
    [LoginType.TaoBao]: new TBLogin(),
    [LoginType.TikTok]: new TKLogin()
  }

  public static handler(type: LoginType) {
    Login.handlerMap[type].handler()
  }
}

Login.handler(LoginType.WX)
Login.handler(LoginType.TaoBao)
Login.handler(LoginType.TikTok)

