# <img src="public/icons/icon_48.png" width="45" align="left"> Page Status

Chrome 浏览器插件。会对页面性能健康状况进行监测，包括：

- ⏱️ 页面加载时间
- 🚂 加载资源数量
- 🐘 大资源数量
- 🐢 慢资源数量
- 📺 平均帧率

页面加载完成后，会自动将页面的加载实现显示在浏览器的工具条中，背景色根据加载时间的快慢 使用“红”“黄”“绿”来标注。**实时反映**页面健康状况。

<img src="https://img.alicdn.com/imgextra/i4/O1CN01DTklIX1fL0bo40S38_!!6000000003989-2-tps-1006-710.png" width="450" />

## 1. 功能

下面对详细的功能进行介绍。

### 1.1 页面加载时间
页面加载时间 表示的是页面触发 `onload` 的时间，会同步到浏览器的工具条中，点击插件图标会显示更详细的页面加载信息，如下图所示：

<img width="450" src="https://img.alicdn.com/imgextra/i3/O1CN0174YqWB1ZW6VeuFB7G_!!6000000003201-2-tps-1016-408.png" />

### 1.2 加载资源数量
页面加载过程中，所有资源的请求都会在这一项中体现出来。这里会按照请求的时间次序进行排列，超过 1S 的资源进行加红标注，直接从缓存读取的会用浅颜色和删除线标注，如下图所示：

<img width="450" src="https://img.alicdn.com/imgextra/i2/O1CN01AxsU9j1jIUtso3RSc_!!6000000004525-2-tps-1012-1010.png" />

### 1.3 大资源数量
页面加载过程中，默认超过 1MB 的资源会被定义为大资源。如下图所示：

<img src="https://img.alicdn.com/imgextra/i4/O1CN0173Q7nq1eViFWewDho_!!6000000003877-2-tps-1018-486.png" width="450" />

### 1.4 慢资源数量

页面加载过程中，默认超过 500ms 的资源会被定义为慢资源。如下图所示：

<img src="https://img.alicdn.com/imgextra/i3/O1CN018x0v3E1dJyU12fFt6_!!6000000003716-2-tps-1010-764.png" width="450" />

### 1.5 平均帧率
会计算页面加载过过程中的平均帧率，如下图所示：

<img src="https://img.alicdn.com/imgextra/i4/O1CN01gGjcL51y3aEvYTFvP_!!6000000006523-2-tps-1010-210.png" width="450">

### 1.6 页面消息通知

默认开启，对超标的项目进行页面内通知的功能，如下图所示：

<img src="https://img.alicdn.com/imgextra/i2/O1CN014k9TAa1i6IjmPfYje_!!6000000004363-2-tps-1276-532.png" width="450" />

## 2. 配置
插件中所有参数都是可以进行配置的，可以点击扩展图标右下角的`小齿轮`按钮进入配置页面，也可以在扩展图标右键选择`选项`进入。

整个配置界面如下图所示：
<img src="https://img.alicdn.com/imgextra/i1/O1CN016plrkG1iID2IWps4e_!!6000000004389-2-tps-3538-1876.png" />