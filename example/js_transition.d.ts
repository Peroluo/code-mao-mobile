// External libs
// These will have to remain until we (or someone else) writes
// proper .d.ts definition files for them.
declare let template:any;
// node's typings definitions currently break stuff, use this instead
declare let DEBUG:any;
interface NodeRequire {
  ensure:(paths:string[], callback:(require:<T>(path:string) => T) => void, name?:string ) => void;
}

interface DefaultObject {[key:string]:any}

declare interface Window {
  gdt:(type:string, action:string, extra?:{[key:string]:any}) => void;
  VConsole:any;
  CODEMAOCONFIG:{
    env:'prod'|'staging'|'test'|'test01'|'test02'|'test03'|'dev';
    language:string;
    host:IHost;
    iris:IIri;
    wechat:IWechat;
    agoraRtc:IAgoraRtc;
    imEnv:string;
    mock:boolean;
    mockHost:string;
    api:IApi;
    zhaoshang:IZhaoshang;
    childrenDay:IChildrenDay;
  };
}

type IChildrenDay = {
	dbRedirect:string;
}

type IZhaoshang = {
	corpNo:string;
}

type IApi = {
	codecamp:string;
	tiger:string;
	rocketApp:string;
	marketing:string;
	ezbuy:string;
    login:string;
	openService:string;
	marketingWeb:string;
}

type IAgoraRtc = {
	appId:string;
}

type IWechat = {
	debug:boolean;
	appId:string;
	host:string;
	appid:string;
	authUrl:string;
}

type IIri = {
	host:string;
	geetestProductId:string;
	waterproofWallProductId:string;
}

type IHost = {
	api:string;
	education:string;
	time:string;
	iris:string;
	ide:string;
	box:string;
	box2:string;
	wood:string;
	lizzy:string;
	tob:string;
	shequ:string;
	mobile:string;
	mlz:string;
	exam:string;
	live2d:ILive2d;
	eventTrack:string;
	dataSdk:string;
	lbkMobile:string;
	bcm:string;
	marketing:string;
	tanyue:string;
	lbkCourseMobile:string;
	rocketAndroidIc:string;
	rocketIosIc:string;
}

type ILive2d = {
	host:string;
	resource:string;
}

declare module 'weui.js'

declare module '*.scss' {
  const content:any;
  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare module '*.mp4' {
  const content:any;
  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare type ResponseWrap<T> = {
  code:number;
  data:T;
  msg:string;
  success:boolean;
  traceId:string;
}
