$(function () {
    //选中的节点
    var nodes;
    var loadNode;

    //禁用默认的右击菜单
    $(document).bind("contextmenu", function (e) {
        return false;
    });

    //设置树的样式
    $('#tree').tree({
        url: 'showtree.do',
        method: 'POST',
        animate: true,
        lines: true,
        checkbox: true,
        dnd: true,
       /* onBeforeDrop: function (target, source, type) {
            var targetNode = $("#tree").tree("getNode", target);
            if (type != "append" && targetNode.parentId == -1) {//企图和根节点同级
                $.messager.alert("警告", "禁止同根节点同级!", "error");
                return false;
            }
            if (type == "append" && targetNode.leaf == true) {//企图插入到叶子节点中
                $.messager.alert("警告", "无法插入至叶子节点!", "error");
                return false;
            }
            return true;
        },*/
       /* onDrop: function (target, source, type) {
            var fatherNodeId;
            if (type == "append")//直接作为某节点的子节点
                fatherNodeId = $("#tree").tree("getNode", target).id;
            else {//通过兄弟节点target找到新的父节点
                var targetNode = $("#tree").tree("getNode", target);
                var parentNode = $("#tree").tree("getParent", target);
                fatherNodeId = parentNode.id;
            }*/
            //请求后台数据库修改
            /*$.ajax({
                url: "showtree.do",
                type: "POST",
                data: {
                    nodeId: source.id,
                    fatherNodeId: fatherNodeId
                },
                success: function (content) {
                    $.messager.alert("提示", "操作成功!", 'info');
                    denyChangeToLeaf("tree", source.parentId);
                    source.parentId = fatherNodeId;
                },
                error: function (xhr, text, ex) {
                    $.messager.alert(ex);
                    returnToOldParent("tree", source);
                }

            })*/
        //},
        onContextMenu(e, node){
            e.preventDefault();
            $(this).tree('select', node.target);
            $('#menu').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        },
        onLoadSuccess(node, data){
        	console.log(data[0]);
//        	$("#_easyui_tree_1>span:first-of-type").addClass("tree-hit tree-collapsed ");
           /* $.ajax({
                url: "showtree.do",
                type: "POST",
                data: {
                    fatherNodeId: "-1"
                },
                success: function (data) {

                    if(!nodeFather.children){
                        $(".tree-node>span").eq($(".tree-node>span").size()-4).removeClass("tree-indent tree-join").addClass("tree-hit tree-collapsed");
                    }
                },
                error: function (err) {
                    console.log(err);
                }

            })*/
        },
        onSelect(){
        	loadNode = $("#tree").tree("getSelected");
            nodes = $('#tree').tree('getChecked');
            console.log(nodes);
            //根据选中判断是否显示删除键
            if (nodes.length == 0) {
                $("#remove").hide();
            } else {
                $("#remove").show();
            }
        },
        onClick(){
        	
        	console.log(loadNode);
//        $.ajax({
//            url: "showtree.do",
//            type: "POST",
//            data: {
//                fatherNodeId: loadNode.id
//            },
//            success: function (data) {
//            	
//            	if(!loadNode.children){
//            		$('#tree').tree('append', {
//                        parent: (loadNode ? loadNode.target : null),
//                        data: data
//                    });
//            	}
//            },
//            error: function (xhr, text, ex) {
//                $.messager.alert(ex);
//                returnToOldParent("tree", source);
//            }
//
//        })
        }
    });


    //设置 content 的高度 为屏幕高度减去 header 的高度
    var height = $(document.body).height() - 80;
    $("#content").css({"height": height + "px"});


    //查看信息
    $("#look").click(function (e) {

        $("#content #left").css({"overflow-y": "hidden"});

        var node = $('#tree').tree('getSelected');

        //点击空白处隐藏
        $(document).click(function () {
            $(".editStr").hide();
            $("#show").hide();
            $("#content #left").css({"overflow-y": "auto"});
        });
        //点击编辑时也要阻止冒泡
        e.stopPropagation();

        //点击自己时也要阻止冒泡
        $(".editStr").click(function (e) {
            e.stopPropagation();
        });
        $("#show").click(function (e) {
            e.stopPropagation();
        });

        //点击其他节点时隐藏
        $("#tree").click(function () {
            $(".editStr").hide();
            $("#show").hide();
            $("#content #left").css({"overflow-y": "auto"});
        });


        $("#show").show();

        //根据 type 类型分别查看
        if (node.type == "1") {
            $("#show>.first>div>.textSpan").html(node.text);
            $("#show>.first").show().siblings().not($("#editBox")).hide();
        } else if (node.type == "2") {
            $("#show>.second").show().siblings().not($("#editBox")).hide();
            $("#show>.second>div>.textSpan").html(node.text);
            $("#show>.second>div>.timeSpan").html(node.time);
            $("#show>.second>div>.typeSpan").html(node.type);
        }

        console.log(node);
        //点击编辑按钮
        $("#edit").off('click').click(function () {
            console.log(node);
            $("#show").hide();
            if (node.type == "1") {
                $(".editStr").show();
                $(".editStr>.first").show().siblings().not($("#btn")).hide();
                $(".editStr #nameOne").val(node.text);

            } else if (node.type == "2") {
                $(".editStr").show();
                $(".editStr>.second").show().siblings().not($("#btn")).hide();
                $(".editStr #nameTwo").val(node.text);
                $(".editStr #time").val(node.time);
                $(".editStr #type").val(node.type);
            }

            //确认按钮，保存信息！ off 取消之前绑定的 click 事件
            $("#sure").off('click').click(function () {

                //根据 type 判断修改类型，trim 除去前后空格
                if (node.type == "1") {
                    var nameOne = Trim($(".editStr #nameOne").val(),"g");
                    if (nameOne != "") {
                        node.text = nameOne;
                        $(".editStr").hide();

                    } else {
                        alert("请填写完整信息！");
                    }
                } else if (node.type == "2") {
                    var nameTwo = Trim($(".editStr #nameTwo").val(), "g");
                    var time = Trim($(".editStr #time").val(), "g");
                    var type = Trim($(".editStr #type").val(), "g");

                    //简单验证是否为空
                    if (nameTwo != "" && time != "" && type != "") {
                        node.text = nameTwo;
                        node.time = time;
                        node.type = type;
                        $(".editStr").hide();
                    } else {
                        alert("请填写完整信息！");
                    }
                }
                console.log(node);
            });

            //取消按钮
            $(".cancel").click(function () {
                $(".editStr").hide();
                return false;
            });


        });

    });

    //添加，待定
    $("#add").click(function () {
        var node = $('#tree').tree('getSelected');
        $('#tree').tree('append', {
            parent: (node ? node.target : null),
            data: [{
                text: '请修改名称'
            }]
        });
    });

    //删除,待定
    $("#remove").click(function () {
        // var node = $('#tree').tree('getSelected');

        //隐藏ContextMenu，显示模态框
        $("#menu").hide();
        $("#dialog").show();

        //根据节点不同提示不同的信息
        if (nodes.length == 1) {
            $("#dialog>div>p").html("您确认删除该文件吗？");
        } else {
            $("#dialog>div>p").html("您确认删除多个文件吗？");
        }

    
        //确认删除
        $("#dialog>div>#yes").click(function () {
            for (var i = 0; i < nodes.length; i++) {
            	console.log(nodes[i].id);
                
                $.ajax({
                    url: "delmodel.do",
                    type: "POST",
                    data: {
                        id: nodes[i].id
                    },
                    success: function (data) {
                    	$('#tree').tree('remove', nodes[i].target);
                    	console.log("成功！")
                    },
                    error: function (xhr, text, ex) {
                        console.log(text)
                    }

                })
            }
            
            $("#dialog").hide();
            console.log(nodes);
        });

        //取消删除
        $("#dialog>div>#no").click(function () {
            $("#dialog").hide();
            return false;
        });

    });

    //去除空格
    function Trim(str, is_global) {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        if (is_global.toLowerCase() == "g") {
            result = result.replace(/\s/g, "");
        }
        return result;
    }


    //防止父节点的所有子节点被删除后父节点变为叶子节点,感觉这是个逻辑BUG
    function denyChangeToLeaf(treeId, parentId) {
        var parentNode = $("#" + treeId).tree("find", parentId);
        var children = $("#" + treeId).tree("getChildren", parentNode.target);
        if (children.length > 0)
            return;
        var $nodeDom = $(parentNode.target);
        $nodeDom.find(".tree-icon").prev().removeClass("tree-indent").addClass(
            "tree-hit tree-collapsed");
    }

    //拖拽更新数据库时如果出问题就还原
    function returnToOldParent(treeId, sourceNode) {
        $("#" + treeId).tree("remove", sourceNode.target);
        var oldParentNode = $("#" + treeId).tree("find", sourceNode.parentId);
        $("#" + treeId).tree("append", {
            parent : oldParentNode.target,
            data : [ {
                id : sourceNode.id,
                text : sourceNode.text,
                iconCls : sourceNode.iconCls,
                checked : sourceNode.checked,
                state : sourceNode.state,
                parentId : sourceNode.parentId,
                leaf : sourceNode.leaf,
                attributes : sourceNode.attributes
            } ]
        });
    }



})