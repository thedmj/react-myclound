import request from "superagent";
var url = "http://101.200.129.112:9527/file/get/";
module.exports = function(path,success,error){
    request.get(url).query({path:path}).end(function(err,res){
        if(err){
            return error(err);
        }
        if(res.ok){
            return success(res.body);
        }
    });
}