//Blues Javascript 函数库
//2012-11-28：函数库建立

// 定义全局变量
var ajaxPost="GET",ajaxCache=true;
var ie6=$.browser.msie&&($.browser.version=="6.0"||($.browser.version=="7.0"&&document.documentMode==7));

// DOM准备好时执行
$(function(){
  // 全局Ajax设置
  $.ajaxSetup({timeout:1e4,cache:ajaxCache});
  // 去掉A标签焦点
  $("a").focusin(function(){this.blur()});
  // 图片链接淡入淡出效果
  $(".ani img")[0]&&$(".ani img").live({mouseenter:function(){$(this).stop().fadeTo(100,0.8)},mouseleave:function(){$(this).stop().fadeTo(100,1)}});
  // 动作确认属性
  $("[data-confirm]")[0]&&$("[data-confirm]").click(function(){return confirm($(this).attr("data-confirm"))});
  // 历史返回属性
  $("[data-back]")[0]&&$("[data-back]").click(function(){window.history.go($(this).attr("data-back"));return !1});
  // 按钮跳转属性
  $("button[data-url]")[0]&&$("button[data-url]").click(function(){Jump($(this).attr("data-url"))});
  // 下拉框选择默认值
  $("select[data-selected]")[0]&&setTimeout(function(){$("select[data-selected]").each(function(){$(this).find("option[selected]").removeAttr("selected").end().find("option[value='"+$(this).attr("data-selected")+"']").attr("selected","selected")})},0);
  // 表单提交时检查正则
  $("form").submit(function(){return RegForm($(this))});
  /* 以下为私有程序 */
  // 全景欣赏页
  if ($("body#map_pano")[0]){
    var v=GetVar("v")!=""?GetVar("v"):"101";
    $("div#pano").empty();
    Pano(v);
  };
  /* 以上为私有程序 */
});

/* 以下为私有函数 */
//函数：载入全景（文件夹）
function Pano(v){
  v="uploadfile/pano/"+v+"/";
  embedpano({swf:"inc/pano.swf",xml:v+"pano.xml",target:"pano",html5:"prefer",passQueryParameters:false,onready:function(){
    $("#krpanoSWFObject pre:last").html(unescape(escape($("#krpanoSWFObject pre:last").html()).replace(/%u6E56%u5357%u7701%u53CB%u8BDA%u79D1%u6280%u6709%u9650%u516C%u53F8/g,"%u5e03%u9c81%u65af%u7f51%u7edc")));
    setTimeout(function(){
      $("#krpanoSWFObject")[0].set("plugin[button_vr].visible",true);
      $("#krpanoSWFObject")[0].set("plugin[button_rotate].visible",true);
    },1e3);
    !!$("#pano[data-bgsnd]")[0]&&setTimeout(function(){
      $("#krpanoSWFObject")[0].set("plugin[button_sound].visible",true);
      $("#krpanoSWFObject")[0].call("playsound(bgsnd,"+$("#pano").attr("data-bgsnd")+",0)");
    },1e3);
  }});
}
/* 以上为私有函数 */

//函数：弹出提示层（提示信息，是否UNBind）
function Alert(v,b){
  var r=Math.ceil(Math.random()*1e5);
  b==undefined&&(b=!0);
  $("div.alert")[0]&&$("div.alert").remove();
  $("body").append("<div class=\"alert r"+r+"\"><span>"+v+"</span></div>");
  this.rAlert=function(){$("div.alert").css({height:$(document).height(),width:$(window).width()}).find("span").css({marginTop:parseInt($(window).height()/2+$(window).scrollTop())+"px"})};
  this.rAlert(),b&&$(window).unbind("resize"),$(window).bind("resize",function(){this.rAlert()});
  $("div.r"+r).fadeTo(200,0.9,function(){setTimeout(function(){$("div.r"+r).remove()},1e3)});
}

//函数：锁屏幕（是否UNBind）
function Locked(b){
  b==undefined&&(b=!0);
  $("div.locked")[0]&&$("div.locked").remove();
  $("body").append("<div class=\"locked\"></div>");
  this.rLocked=function(){$("div.locked").css({height:$(document).height(),width:$(window).width(),backgroundPosition:"center "+parseInt($(window).height()/2+$(window).scrollTop())+"px"})};
  this.rLocked(),b&&$(window).unbind("resize"),$(window).bind("resize",function(){this.rLocked()});
  $("div.locked").fadeTo(200,0.6);
}

//函数：解锁屏幕（无参数）
function UnLocked(){
  $("div.locked").remove();
}

//函数：通用AJAX返回处理（返回信息，错误提示）
function ReAjax(v,e){
  v.split("|")[1]!=undefined&&(e=v.split("|")[1]);
  var b=!0;
  switch (v.split("|")[0]){
    case "error":Alert(e==undefined?"Error":e);
    break;
    case "timeout":Jump(location.href);
    break;
    default:b=!1;
  };
  return b;
}

//函数：通用表单提交（DOM，匿名函数）
function Submit(dom,f){
  f==undefined&&(f=function(dom){});
  Locked();
  if (RegForm(dom)){
    GetVar("debug")=="blues"&&Debug("[url]:"+dom.attr("action")+"\n[data]:"+dom.serialize());
    $.ajax({url:dom.attr("action"),data:dom.serialize(),type:ajaxPost,success:function(data){
      GetVar("debug")=="blues"&&Debug("[data]:"+data);
      UnLocked();
      if (ReAjax(data,"表单提交失败")) return;
      if (data=="done"){
        f(dom);
        Alert("表单提交成功");
      };
    },error:function(){
      UnLocked();
      Alert("表单提交超时");
    }});
  }else{
    UnLocked();
    Alert("请检查输入");
  };
  return !1;
}

//函数：错误调试（提示信息）
function Debug(v){
  v=v.replace(/</g,"&lt;").replace(/\n/g,"<br>").replace("[info]:","<font color=red>[info]:</font>").replace("[url]:","<font color=red>[url]:</font>").replace("[data]:","<font color=red>[data]:</font>");
  $("div.debug")[0]||$("body").append("<div class=\"debug\"></div>");
  $("div.debug").fadeTo(0,0.8).prepend(v+"<hr>").dblclick(function(){$(this).remove()});
}

//函数：判断是否移动设备（无参数）
function isMobile(){
  var v=!1,Agent=["iphone","ipod","ipad","android","mobile","blackberry","webos","incognito","webmate","bada","nokia","lg","ucweb","skyfire"],thisSys=navigator.userAgent.toLowerCase();
  $.each(Agent,function(i,n){thisSys.indexOf(n)!=-1&&(v=!0)});
  return v;
}

//函数：图层显示（DOM，时间）
function Show(dom,t){
  $(dom)[0]?$(dom).fadeOut(t).fadeIn(t):$(dom).fadeIn(t);
}

//函数：图层隐藏（DOM，时间）
function Hide(dom,t){
  $(dom).fadeOut(t);
}

//函数：检查表单符合正则(DOM)
function RegForm(dom){
  var v=!0,i=0;
  dom.find("input,select,textarea").each(function(){
    $(this).attr("data-reg")!=""&&(new RegExp($(this).attr("data-reg"))).exec($(this).val())==null&&(v=!1,i++,$(this).css({"backgroundColor":"#eee","borderColor":"#1369b7"}).one("focusin",function(){$(this).css({"backgroundColor":"","borderColor":""})}));
  });
  v||Alert("有 "+i+" 处错误, 请检查");
  return v;
}

//函数：页面跳转（地址）
function Jump(url){
  location.href=url;
}

//函数：获取URL参数（变量）
function GetVar(s){
  var r=new RegExp("(^|)"+s+"=([^\&]*)(\&|$)","gi").exec(String(location.href)),t;
  if (t=r) return t[2];
  return "";
}

//函数：设置Cookie（名字，值）
function SetCookie(n,value){
  var Days=30;
  var exp=new Date();
  exp.setTime(exp.getTime()+Days*86400*1000);
  document.cookie=n+"="+escape(value)+";expires="+exp.toGMTString();
}

//函数：获取Cookie（名字）
function GetCookie(n){
  var arr=document.cookie.match(new RegExp("(^| )"+n+"=([^;]*)(;|$)"));
  if(arr!=null) return unescape(arr[2]);
  return null;
}

//函数：删除Cookie（名字）
function DelCookie(n){
  var exp=new Date();
  exp.setTime(exp.getTime()-1);
  var cval=GetCookie(n);
  if(cval!=null) document.cookie=n+"="+cval+";expires="+exp.toGMTString();
}