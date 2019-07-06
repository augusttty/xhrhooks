class ajaxHooksFuncPackage {
    init() {
        this.renderHtml()
        this.updateHtml()
        this.registerEvent.call(this)
    }
    registerEvent() {
        var regObj = localStorage.getItem('AjaxHook/Rules') ? JSON.parse(localStorage.getItem('AjaxHook/Rules')) : {}
        //添加规则
        document.getElementById('html2JsaddBtn').addEventListener('click', () => {
            var regKey = document.getElementById('tagInputReg').value
            var regVal = document.getElementById('tagInputRplace').value
            Object.assign(regObj, { [regKey]: regVal })
            this.setLocalStorage(`AjaxHook/Rules`, JSON.stringify(regObj))
            this.updateHtml()
            window.location.reload()
        })
        //清空规则
        document.getElementById('ajaxHookClearCache').addEventListener('click', () => {
            localStorage.removeItem('AjaxHook/Rules')
            localStorage.removeItem('AjaxHook/Enable')
            regObj = {}
            this.updateHtml()
        })
        //刷新
        document.getElementById('ajaxHookMatchBtn').addEventListener('click', () => {
            window.location.reload()
        })
        document.getElementById('ajaxHookShow').addEventListener('click', () => {
            if (document.getElementById('ajaxHookContent').style.display == 'none') {
                document.getElementById('ajaxHookContent').style.display = 'block'
            } else {
                document.getElementById('ajaxHookContent').style.display = 'none'
            }
        })
        //下载
        document.getElementById('ajaxHookDown').addEventListener('click', () => {
            this.downJsonConfig("hello.txt", localStorage.getItem('AjaxHook/Rules'))
        })
        //导入config
        document.getElementById('ajaxHookRead').addEventListener('click', () => {
            let text = this.fileLeadIn('/.xhrhookrc')
            localStorage.removeItem('AjaxHook/Rules')
            localStorage.setItem('AjaxHook/Rules', text)
            this.updateHtml()
        })
    }
    updateHtml() {
        document.getElementById('ajaxHooksUl').innerHTML = ''
        if (localStorage.getItem('AjaxHook/Rules') && localStorage.getItem('AjaxHook/Rules') != '[]') {
            Object.keys(JSON.parse(localStorage.getItem('AjaxHook/Rules'))).map(key => {
                var nodeEl = document.createElement('li')
                nodeEl.innerHTML = key + ' -> ' + JSON.parse(localStorage.getItem('AjaxHook/Rules'))[key]
                nodeEl.style.marginTop = '10px'
                nodeEl.style.background = '#e2e2e2'
                nodeEl.addEventListener('click', function () {
                    console.log(this)
                })
                document.getElementById('ajaxHooksUl').appendChild(nodeEl)
            })
        }
    }
    setLocalStorage(item, val) {
        localStorage.setItem(item, val)
    }
    downJsonConfig(filename, text) {
        var element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }
    fileLeadIn(name) {
        let xhr = new XMLHttpRequest(),
            okStatus = document.location.protocol === "file:" ? 0 : 200;
        xhr.open('GET', name, false);
        xhr.overrideMimeType("text/html;charset=utf-8")
        xhr.send(null);
        return xhr.status === okStatus ? xhr.responseText : null;
    }
    renderHtml() {
        document.writeln("<div id='ajaxHookContent' style=\'display:none;border-radius:8px;width: 90%;max-width:550px;margin:0 auto;text-align:center;background: white;padding:20px;\'>");
        document.writeln("        <div style='margin:0 5px;'>");
        document.writeln("            <div style=\'display: flex;justify-content: space-between;\'>");
        document.writeln("                <input style='width:46%;padding-left:5px;' type=\'text\' id=\'tagInputReg\' placeholder=\'规则\'>");
        document.writeln("                <input style='width:46%;padding-left:5px;' type=\'text\' id=\'tagInputRplace\' placeholder=\'替换\'>");
        document.writeln("");
        document.writeln("            </div>");
        document.writeln("            <button id=\'html2JsaddBtn\' style=\'outline:none;margin-top: 15px\'>添加规则</button>");
        document.writeln("            <button id=\'ajaxHookMatchBtn\' style=\'margin:15px 10px;outline:none;margin-top: 15px\'>刷新</button>");
        document.writeln("            <button id=\'ajaxHookClearCache\' style=\'outline:none;margin-top: 15px;\'>清空规则</button>");
        document.writeln("            <button id=\'ajaxHookDown\' style=\'outline:none;margin-top: 15px;\'>下载</button>");
        document.writeln("            <button id=\'ajaxHookRead\' style=\'outline:none;margin-top: 15px;\'>读取</button>");
        document.writeln("");
        document.writeln("        </div>");
        document.writeln("<span>规则列表:</span>")
        document.writeln("        <ul id=\'ajaxHooksUl\' style=\'list-style: none;padding-left:0;\'>");
        document.writeln("");
        document.writeln("        </ul>");
        document.writeln("        </ul>");
        document.writeln("<div id='hasReplace'>");
        document.writeln("    </div>");
        document.writeln("</div>");
        document.writeln(" <div id='ajaxHookShow' style=\'text-align:center;width:30px;height:30px;background:white;position: fixed;bottom:10vh;right:10vw;border-radius:50%;\'>");
        document.writeln("<div style=\'text-align:center;width:20px;height:20px;background:#6f6d6d;position: absolute;bottom:5px;right:5px;border-radius:50%;\'>");
        document.writeln("</div>");
        document.writeln("</div>");
    }
}
(function () {
    var nowUrl = window.location.href
    var myAjaxHooks = new ajaxHooksFuncPackage(nowUrl)
    if (window.location.search.indexOf('ajax-hook') === -1 && !localStorage.getItem('AjaxHook/Enable')) {
        return false
    }
    localStorage.setItem('AjaxHook/Enable', true)
    myAjaxHooks.init()
    XMLHttpRequest.prototype.nativeOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        var oldUrl = location.protocol + '//' + location.host
        var newUrl = oldUrl
        if (localStorage.getItem('AjaxHook/Rules')) {
            var localObj = JSON.parse(localStorage.getItem('AjaxHook/Rules'))
            Object.keys(localObj).reverse().map(item => {
                newUrl = oldUrl.replace(new RegExp(item), localObj[item])
            })
        }
        document.getElementById('hasReplace').innerHTML = ''
        document.getElementById('hasReplace').innerHTML = `${oldUrl} --> ${newUrl}`
        newUrl += url
        console.log(newUrl)
        if (newUrl.indexOf('xhrhookrc') == -1) {
            this.nativeOpen(method, newUrl, async, user, password)
        } else {
            this.nativeOpen(method, url, async, user, password)
        }
    }

})()

