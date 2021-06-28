# 基础镜像
# FROM registry.cn-hangzhou.aliyuncs.com/codemaohub/codemao-master:8-onbuild
FROM registry-vpc.cn-hangzhou.aliyuncs.com/codemaohub/codemao-master:10-onbuild

# 下载七牛上传工具qshell
RUN mkdir /srv/qiniu && \
  curl -o /srv/qiniu/qshell https://ops-files.codemao.cn/qshell && \
  chmod -R +x /srv/qiniu

# 指定当前用户(codemao用户没有写入权限)
USER codemao

# Workdir is unprivileged user home
WORKDIR /usr/src/app

# 安装依赖
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
COPY .npmrc /usr/src/app

# gitlab npm仓库token
ARG CI_JOB_TOKEN=''

RUN npm install

# 复制代码
COPY . /usr/src/app/

# 声明环境变量
ARG QN_AKEY=''
ARG QN_SKEY=''
ARG front_env=''

# build正式环境
RUN npm run build

# 静态资源上传到cdn
RUN npm run cdn_upload

# 暴露内部端口号
EXPOSE 5000

# 起服务
ENTRYPOINT ["npm", "run"]
CMD ["production"]