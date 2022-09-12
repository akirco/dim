## reference

- [Real-ESRGAN-ncnn-vulkan](https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan)

## install

- windows

```powershell
scoop bucket add aki 'https://github.com/akirco/aki-apps.git'
scoop install dim
```


`scoop shims`好像是单个bin文件的工作方式，利用软链接应该可以实现，先这样搞,添加脚本到`$profile`

```powershell
 #set init dim

 $env:dim = $(scoop prefix dim)
 [System.Environment]::SetEnvironmentVariable('dim',$env:dim,'User')
 $Env:PATH += $env:dim+';'
 [System.Environment]::SetEnvironmentVariable('path',$Env:PATH,'User')
```

## manual install

```
$current_path = Get-Location

$env:dim = $current_path

[System.Environment]::SetEnvironmentVariable("dim",$env:dim,'User')

$Env:PATH += $env:dim+';'

[System.Environment]::SetEnvironmentVariable("PATH",$Env:PATH,'User')
```

### or

手动添加Path变量
