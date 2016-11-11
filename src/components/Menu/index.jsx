import React from 'react';
import "./index.css";
var Menu =React.createClass({

    render:function(){
        var style={
            display:this.props.showMenu?"block":"none",
            left:this.props.position.x,
            top:this.props.position.y
        }
        return (
            <div className="menu" style={style} >
                <ul>
                    <li style={{display:!!this.props.selectedItemName?"none":"block"}} onMouseDown={this.props.newfolder}>新建文件夹</li>
                    <li style={{display:!!this.props.selectedItemName?"block":"none"}}>复制</li>
                    <li style={{display:!!this.props.selectedItemName?"block":"none"}}>剪切</li>
                    <li style={{display:!!this.props.selectedItemName?"block":"none"}}>粘贴</li>
                    <li style={{display:!!this.props.selectedItemName?"block":"none"}} onMouseDown={this.props.delete}>删除</li>
                    <li style={{display:!!this.props.selectedItemName?"block":"none"}} onMouseDown={this.props.onrename}>重命名</li>
                </ul>
            </div>
        );
    },
    
});
module.exports = Menu;