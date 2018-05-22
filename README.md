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

## 个性化配置
### 设备映射
- 默认情况下, 插件会自动选择插件支持的Hass的设备映射到Rokid家庭中. 匹配的逻辑如下表:

Domain | 是否默认映射 | Rokid设备类型
------ | -------| ------------
climate | 是 | 空调
cover | 是 | 窗帘
fan | 是 | 电风扇
light | 是 | 灯
lock | 是 | 门锁
switch | 是 | 开关
vacuum | 是 | 扫地机器人
input_boolean | 是 | 开关
media_player | 是 | 电视
remote | 是 | 遥控器
script | 是 | 场景
automation | 否 | -
- 如果有不希望映射到Rokid的设备, 请在Hass的config yaml给设备添加**rhass_hidden**属性并设置为**true**.
- 如果有希望映射到Rokid的设备, 请在Hass的config yaml给设备添加**rhass_show**属性并设置为**true**
- 参考下面的例子:

```
homeassistant:
  customize:
    switch.ac:
      rhass_hidden: true
# 整个domain进行配置
  customize_domain:
    automation:
      rhass_show: true
```

### 更改设备配型
- 默认情况下, 插件会根据Hass设备的Domain匹配Rokid家庭的设备类型, 如有需要修改Rokid家庭的设备类型的需求, 请在Hass的config yaml给设备添加**rhass_type**属性. 参考下面的例子:
- Rokid支持的设备类型请参考 此链接<https://developer.rokid.com/docs/rokid-homebase-docs/v1/device/type.html>
```
homeassistant:
  customize:
    switch.decorative_lights:
      rhass_type: 'socket'
```

### 指定设备名称
- 默认情况下, 插件会将Hass设备的*friendly_name*设置为Rokid家庭中设备的名字. 如果Hass设备没有*friendly_name*属性, 则使用*entity_id*作为设备名字.
- 如果用户有自定义Rokid家庭中设备名字的需求, 不希望按照上述的逻辑生成名字, 则可以使用**rhass_name**属性来给设备设置名字.
```
homeassistant:
  customize:
    switch.decorative_lights:
      rhass_name: '装饰灯'
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

