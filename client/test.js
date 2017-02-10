var address = "http://10.0.115.233:8080";
$("#test").click(function(){
	$.ajax({
        url: address+"/windows",
        type: "GET",
        dataType: "JSON",
        crossDomain: true,
        beforeSend: function(xhr){xhr.setRequestHeader('x-access-token',localStorage.getItem('token'));},
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        data:null,
        success: function(data) {
            console.log(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('windows !');
        }
    });
})
