//Blues Javascript 函数库
//2012-11-28：函数库建立

// DOM准备好时执行
$(function(){
  // 全景欣赏页
  if ($("#map_pano")[0]){
    var v=GetVar("v")!=""?GetVar("v"):"101";
    $("#pano").empty();
    Pano(v);
  };
});

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

//函数：获取URL参数（变量）
function GetVar(s){
  var r=new RegExp("(^|)"+s+"=([^\&]*)(\&|$)","gi").exec(String(location.href)),t;
  if (t=r) return t[2];
  return "";
}
