# Mobile template | 移动端项目模板

移动端项目是指，类应用的移动端项目包括：微信公众号开发相关，h5功能类项目。此项目不适合落地页等展示型项目。

## 下载

装有yuumi cli的项目：

```
yuumi init mobile-test

// 然后选择Mobile-template
```

普通调试的项目：

```
git clone git@github.com:cmao-cli/Mobile-template.git
```

## 安装依赖

```
npm install
```

## 开发调试

装有yuumi cli的项目：

```
yuumi serve
```

普通调试的项目：

```
npm start
```

## 运行example

装有yuumi cli的项目：

```
yuumi upgrade -e

yuumi serve example/index.tsx
```

## 打包build

装有yuumi cli的项目：

```
yuumi build
```

普通调试的项目：

```
npm run build
```

## 正式环境运行

```
npm run production
```