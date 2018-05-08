# HASSmart Rokid插件
此插件将Homeassistant智能家居开源平台中的设备加入到Rokid家庭中, 使用者可以方便的通过Rokid使用语音来控制自己Homeassistant平台中已经接入的设备.    

此插件由HASSmart老妖提供.
如有问题, 可在瀚思彼岸<https://bbs.hassbian.com/forum.php> Homeassistant中文第一技术论坛发帖反馈.

## 使用帮助
- 绑定HASSmart插件.
- 确认Hass已经在运行且可以访问到.
- 在登录界面中输入Hass的地址和Hass登录密码. 如无密码登录, 密码栏请留空. 参考下面的例子:
```
账号: http://127.0.0.1:8123
密码: passwd
```
- 请确认账号务必写明**http**或者**https**, 插件将依靠此信息使用http或者https访问Hass.
- 默认情况下, 插件会将所有Hass支持的设备映射到Rokid家庭中. 如果有不希望映射到Rokid的设备, 请在Hass的config yaml给设备添加**rhass_hidden**属性并设置为**true**. 参考下面的例子:
```
homeassistant:
  customize:
    switch.ac:
      rhass_hidden: true
```
- 默认情况下, 插件会根据Hass设备的Domain匹配Rokid家庭的设备类型, 如有需要修改Rokid家庭的设备类型的需求, 请在Hass的config yaml给设备添加**rhass_type**属性. 参考下面的例子:
```
homeassistant:
  customize:
    switch.decorative_lights:
      rhass_type: 'socket'
```

## 目前支持的设备
插件根据Hass Entity的Domain自动映射到Rokid家庭中, 目前支持的Hass Domain有:
- climate
- cover
- fan
- light
- lock
- switch
- vacuum
- automation
- input_boolean
- media_player
- remote
- script

未适配的Domain可以在Hass中尝试使用template设备转换为上述Domain的设备.    
如有更多需求, 请参考下述问题反馈的链接反馈需求和问题.

## 问题反馈
bbs: <https://bbs.hassbian.com/forum.php>  
github: <https://github.com/SchumyHao/homebase-driver-hass/issues>  
mail: <schumy.haojl@gmail.com>

