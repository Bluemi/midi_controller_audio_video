var xhr=new XMLHttpRequest();
xhr.open("GET",prompt('url:',location.href),true);
xhr.onload=function(){
	var r=xhr.responseText;
	r=r.substring(r.indexOf('url_encoded_fmt_stream_map'),r.length);
	r=r.substring(r.indexOf('url=http')+4,r.length);
	r=r.split('url=');
	console.log('Best Quality:');
	console.log(decodeURIComponent(r[0].substring(0,r[0].indexOf('\\\\'))));
};
xhr.send();
