// edit 2016/11/10
import React from 'react';
// import ReactDOM from 'react-dom';
import ajax from "./ajax.js";
import { Icon ,Breadcrumb,Input} from "antd";
import { Router, Route, hashHistory ,Link} from 'react-router';
import Loading from "../Loading";
import $ from "jquery";
import Menu from "../Menu";
require("./index.css");
require("antd/dist/antd.css");
import TweenMax from "../../../gsap/TweenMax.js";
import request from "superagent";

var Filelistitem = React.createClass({
    getInitialState:function(){
        return {
            showRename:false,
            title:this.props.title,
            path:this.props.path
        }
        
    },
    render: function () {
        var style={
            background:this.props.active?"blue":"inherit"
        }
        var typeList={".html":"code",".txt":"file-text",".jpg":"file-jpg",".png":"picture",".git":"picture",".md":"book"};
        
        var type = typeList[this.props.ext];
        if(!typeList[this.props.ext]){
            type="file-unknown"
        };
        return (
            <li  onMouseDown={this.rightClick} style={style}>
            
                <span className="icon" onClick={(path,isfolder) => { this.props.itemclick(this.state.path,this.props.isfolder); } }>
                    <Icon type={this.props.isfolder?"folder":type} />
                </span>
                <span className="title" style={{display:this.state.showRename?"none":"inline-block"}}>
                    {this.state.title}
                </span>
                <div className="rename" style={{display:this.state.showRename?"block":"none"}}>
                    <Input type="text" defaultValue={this.props.title} ref={this.props.title} onMouseDown={(e)=>{e.stopPropagation();}} onPressEnter={this.onPressEnter}/>
                </div>
            </li>
        )
    },
    onPressEnter:function(e){ //rename输入回车
        this.rename(this.props.path,e.target.value);
        
    },
    rename:function(path,name){ //重命名函数
        var url = "http://101.200.129.112:9527/file/rename/";
        var This = this;
        request.get(url).query({
            path:path,
            name:name
        }).end(function(err,res){
            if(err){console.log(err)}
            if(res.ok){
                // This.props.cancel();
                This.setState({
                    title:name,
                    path:res.body.path,
                    showRename:false
                });
                
            }
        });
    },
    componentDidUpdate:function(){
        if(this.props.pickItemName === this.props.title){
            
            
        }
    },
    componentWillReceiveProps:function(nextProps){ //更换选中项后取消激活rename 这里componentWillReceiveProps会遍历items
        if(this.props.selectedItem.name===""){
            this.setState({
                showRename:false
            });
        }
    },
    
    rightClick:function(e){ //右键文件激活选中项
        if(e.button === 2){
            if(!!this.props.filelist.state.selectedItem.item){
                this.props.filelist.state.selectedItem.item.setState({
                    showRename:false
                });
            }
            
            this.props.pickItem(this.props.title,this);
        }
    },
    
});
var url = "http://101.200.129.112:9527/static/";

// ------------------------------------------------------------------------------------


var Filelist = React.createClass({
    getInitialState: function () {
        return { dir: [], path: "/"+this.props.routeParams.splat ,loading:false,selectedItem:{name:"",item:null},showMenu:false,position:{x:0,y:0}}
    },
    componentDidMount: function () {
        this.setState({loading:true});
        var This = this;
        ajax(this.state.path, function (res) {
            This.setState({ dir: res.file ,loading:false});
            var t = new TweenMax.TimelineMax();
            var text = $(".filelist h1 span");
            t.staggerFrom(text, 3, { transformOrigin: "50% -500%", rotationZ: "90deg", ease: TweenMax.Elastic.easeOut.config(1, 0.3) }, 0.1);
            t.staggerTo(text, 0.3, { autoAlpha:1 }, 0.1, "-=4.5");
        }, function (err) {
            console.log(err);
        });
    },
    render: function () {
        var This = this;
        var dir = this.state.dir;
        var items = dir.map(function (item, index) {
            var active = false;
            if(item.name === This.state.selectedItem.name){
                active = true;
            }
            return <Filelistitem  active={active} key={item.path+item.name} title={item.name} itemclick={This.itemClickHandle} path={item.path} ext={item.ext} isfolder={item.isFolder} pickItem={This.pickItem} pickItemName={This.state.selectedItem.name} selectedItem={This.state.selectedItem} cancel={This.cancel} filelist={This}/>
        });
        var breadItems =[];
        var breadPath="";
        breadItems = this.props.params.splat.split("/").map(function (o,index){
            breadPath+="/"+o;
            return (
                <Breadcrumb.Item key={o+index}><Link to={breadPath}>{o}</Link></Breadcrumb.Item>
            )
        });
        
        return (
            <div className="filelist" onContextMenu={(e)=>{e.preventDefault();}} onMouseDown={this.rightClick}>
                <h1><span>C</span><span>L</span><span>O</span><span>U</span><span>N</span><span>D</span><span>云</span><span>盘</span></h1>
                <div className="bread">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                        {breadItems}
                    </Breadcrumb>
                </div>
                <ul style={{"WebkitFilter":this.state.loading?"blur(6px)":"blur(0px)"}}>
                    {items}
                </ul>
                <Loading show={this.state.loading} />
                <Menu  position={this.state.position} showMenu={this.state.showMenu} onrename={this.renameShow} selectedItemName={this.state.selectedItem.name}/>
            </div>
        )
    },
    itemClickHandle: function (path,isfolder) { //文件点击事件
        if(isfolder){
            hashHistory.push(path);
        }else{
            window.open(url+ path);
            
        }
        
    },componentWillReceiveProps: function(nextProps) { //改变路由时获取路径来改变state
        var path =nextProps.routeParams.splat;
        if(this.props.routeParams.splat!== path){
            this.update(path);
        }
    },
    update:function(path){ //请求函数
        this.setState({loading:true});
        var This = this;
        ajax(path, function (res) {
            This.setState({ dir: res.file, path: path,loading:false });
        }, function (err) {
            console.log(err);
        });
    },

    pickItem:function(filename,file){ //获取选中项
        this.setState({
            selectedItem:{
                name:filename,
                item:file
            }
        });
    },
    rightClick:function(e){ //右键弹出菜单 左键隐藏
        if(e.button ===2){
            this.setState({
                showMenu:true,
                position:{
                    x:e.clientX,
                    y:e.clientY
                }
            });
        }else{
            if(!!this.state.selectedItem.item){
                this.state.selectedItem.item.setState({
                showRename:false
            });
            }
            
            this.cancel();
        }
    },
    cancel:function(){
        this.setState({
            showMenu:false,
            selectedItem:{
                name:"",
                item:null
            }
        });
    },
    renameShow:function(e){ //激活重命名
        e.stopPropagation();
        
        this.setState({
            showMenu:false
        });
        this.state.selectedItem.item.setState({
            showRename:true
        })

    },
    

});

var R = React.createClass({
    render: function () {
        return (
            <Router history={hashHistory}>
                <Route path="/*" component={Filelist} />
            </Router>
        )
    }
});
module.exports = R;