import React from 'react';
import ajax from "./ajax.js";
import { Icon } from "antd";
import { Router, Route, hashHistory } from 'react-router';
import Loading from "../Loading";
import $ from "jquery";
require("./index.css");
require("antd/dist/antd.min.css");
// var TimelineMax = require("../../../gsap/TweenMax.js");
import TweenMax from "../../../gsap/TweenMax.js";

var Filelistitem = React.createClass({
    render: function () {
        return (
            <li onClick={(path,isfolder) => { this.props.itemclick(this.props.path,this.props.isfolder); } }>
                <span className="icon">
                    <Icon type={this.props.isfolder?"folder":"link"} />
                </span>
                <span className="title">
                    {this.props.title}
                </span>
            </li>
        )
    },

});

var Filelist = React.createClass({
    getInitialState: function () {
        return { dir: [], path: "/"+this.props.routeParams.splat ,loading:false}
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
            return <Filelistitem key={item + index} title={item.name} itemclick={This.itemClickHandle} path={item.path} isfolder={item.isFolder}/>
        });
        console.log();
        return (
            <div className="filelist" >
            <h1><span>C</span><span>L</span><span>O</span><span>U</span><span>N</span><span>D</span><span>云</span><span>盘</span></h1>
                <ul style={{"WebkitFilter":this.state.loading?"blur(6px)":"blur(0px)"}}>
                    {items}
                </ul>
                <Loading show={this.state.loading} />
            </div>
        )
    },
    itemClickHandle: function (path,isfolder) {
        if(isfolder){
            this.update(path,true);
        }else{
            // hashHistory.push(path);
            window.open(path);
        }
        
    },componentWillReceiveProps: function(nextProps) {
        var path ="/"+nextProps.routeParams.splat;
        this.update(path,false);
    },
    update:function(path,needPush){
        this.setState({loading:true});
        var This = this;
        ajax(path, function (res) {
            if(needPush){hashHistory.push(path);}
            This.setState({ dir: res.file, path: path,loading:false });
        }, function (err) {
            console.log(err);
        });
    }

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