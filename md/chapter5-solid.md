### SOLID 原则

#### SOLID 原则是面向对象编程中的基本原则，它包括以下这些五项基本原则。

S，单一功能原则，一个类应该仅具有一种职责，这也意味着只存在一种原因使得需要修改类的代码。如对于一个数据实体的操作，其读操作和写操作也应当被视为两种不同的职责，并被分配到两个类中。更进一步，对实体的业务逻辑和对实体的入库逻辑也都应该被拆分开来。

O，开放封闭原则，一个类应该是可扩展但不可修改的。即假设我们的业务中支持通过微信、支付宝登录，原本在一个 login 方法中进行 if else 判断，假设后面又新增了抖音登录、美团登录，难道要再加 else if 分支（或 switch case）吗？
```javascript
enum LoginType {
  WeChat,
  TaoBao,
  TikTok,
  // ...
}

class Login {
  public static handler(type: LoginType) {
    if (type === LoginType.WeChat) { }
    else if (type === LoginType.TikTok) { }
    else if (type === LoginType.TaoBao) { }
    else {
      throw new Error("Invalid Login Type!")
    }
  }
}
```
当然不，基于开放封闭原则，我们应当将登录的基础逻辑抽离出来，不同的登录方式通过扩展这个基础类来实现自己的特殊逻辑。
```javascript
abstract class LoginHandler {
  abstract handler(): void
}

class WeChatLoginHandler implements LoginHandler {
  handler() { }
}

class TaoBaoLoginHandler implements LoginHandler {
  handler() { }
}

class TikTokLoginHandler implements LoginHandler {
  handler() { }
}

class Login {
  public static handlerMap: Record<LoginType, LoginHandler> = {
    [LoginType.TaoBao]: new TaoBaoLoginHandler(),
    [LoginType.TikTok]: new TikTokLoginHandler(),
    [LoginType.WeChat]: new WeChatLoginHandler(),

  }
  public static handler(type: LoginType) {
    Login.handlerMap[type].handler()
  }
}
```