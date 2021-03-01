//Blues Javascript 函数库
//2012-11-28：函数库建立

// DOM准备好时执行
$(function(){
  // 全景图片
  if ($("#map_pano")[0]){
    var v=GetVar("v")!=""?GetVar("v"):"101";
    $("#pano").empty();
    Pano(v);
  };
  // 全景视频
  if ($("#map_video")[0]){
    var v=GetVar("v")!=""?GetVar("v"):"v01";
    $("#pano").empty();
    Video(v);
  };
});

//函数：载入全景图片（文件夹）
function Pano(v){
  v="uploadfile/pano/"+v+"/";
  embedpano({swf:"inc/pano.swf",xml:v+"pano.xml",target:"pano",html5:"prefer",passQueryParameters:false,onready:function(){
    $("#krpanoSWFObject pre:last").html(unescape(escape($("#krpanoSWFObject pre:last").html()).replace(/Joseph%20Fouts%20Photography/g,"%u5e03%u9c81%u65af%u7f51%u7edc")));
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

//函数：载入全景视频（文件夹）
function Video(v){
  v="uploadfile/video/"+v+"/";
  embedpano({swf:"inc/pano.swf",xml:v+"video.xml",target:"pano",html5:"prefer",passQueryParameters:false,onready:function(){
    $("#krpanoSWFObject pre:last").html(unescape(escape($("#krpanoSWFObject pre:last").html()).replace(/Joseph%20Fouts%20Photography/g,"%u5e03%u9c81%u65af%u7f51%u7edc")));
  }});
}

//函数：获取URL参数（变量）
function GetVar(s){
  var r=new RegExp("(^|)"+s+"=([^\&]*)(\&|$)","gi").exec(String(location.href)),t;
  if (t=r) return t[2];
  return "";
}
