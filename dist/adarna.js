/*!
 * Adarna v1.0.21
 * A suite of javascript classes that will help you build front end user interfaces.
 *
 * Author John Patrick Lataquin
 * Released under the MIT license
 * 
 * Software authors provide no warranty with the software and are not liable for anything.
 *
 * Date: 2021-08-04
 */

let log = ()=>{};

window.activateLogger = ()=>{

    log = (msg)=>{

        console.log(msg);
        
    }
}

window.deactivateLogger = () =>{
    log = () => {};
}


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function cloneEl(el){
    let newEl = el.cloneNode(true);

    //Copy property events
    for(let i in el) {
      if(i.substr(0,2) == 'on' && typeof(el[i])=='function') {
         newEl[i] = el[i];
      }
    }

    //Clone Controller
    if(typeof el.cloneController != 'undefined'){
        newEl.cloneController = el.cloneController;
        newEl.cloneController();
    }

    return newEl;
}

function getAllComponents(elem){
    
    let check = elem instanceof HTMLElement;

    if(!check){
        return [];
    }

    let items = [];

    let components = elem.querySelectorAll('[data-component-id]');
    
    if(components){
        items = Array.from(components) ;
    }
   
    return items;
    
   
}

function removeEl(target){
   
   let parent = target.parentElement;
    
   let components = getAllComponents(target);

   let removeEvent = new CustomEvent('adarna-on-remove',{
        detail:{
            from: parent
        }
    });

   components.map((el)=>{
        el.dispatchEvent(removeEvent);
   });

   target.dispatchEvent(removeEvent);

   parent.removeChild(target);
}

function appendEl(element){

    return {

        after: (target)=>{

            let components   = getAllComponents(element);

            if(element.parentElement){

               let parent       = element.parentElement;
              
               let removeEvent  = new CustomEvent('adarna-on-remove',{
                    detail:{
                        from: parent
                    }
                });

               components.map((el)=>{      
                    el.dispatchEvent(removeEvent);
               });

               element.dispatchEvent(removeEvent);
            }

            let mountEvent = new CustomEvent('adarna-on-mount');

            target.parentNode.insertBefore(element, target.nextSibling);

            element.dispatchEvent(mountEvent);

            let isInPage    = document.body.contains(target);

            if(isInPage){

                let onPageEvent = new CustomEvent('adarna-on-page');
                element.dispatchEvent(onPageEvent);
                components.map((el)=>{  
                    el.dispatchEvent(onPageEvent);
                });
            }
            
        },
        to: (target)=>{

            let components   = getAllComponents(element);

            if(element.parentElement){

               let parent       = element.parentElement;
              
               let removeEvent  = new CustomEvent('adarna-on-remove',{
                    detail:{
                        from: parent
                    }
                });

               components.map((el)=>{      
                    el.dispatchEvent(removeEvent);
               });

               element.dispatchEvent(removeEvent);
            }

            let mountEvent = new CustomEvent('adarna-on-mount');

            target.appendChild(element);
            
            element.dispatchEvent(mountEvent);
            
            let isInPage    = document.body.contains(target);//(target === document.body) ? false : document.body.contains(target);

            if(isInPage){

                let onPageEvent = new CustomEvent('adarna-on-page');
                element.dispatchEvent(onPageEvent);
                components.map((el)=>{  
                    el.dispatchEvent(onPageEvent);
                });
            }

        }
    }
}

function replaceEl(target){

    return {

        with: (element)=>{

            let components   = getAllComponents(element);

            if(element.parentElement){
               
               let parent       = element.parentElement;
               let removeEvent  = new CustomEvent('adarna-on-remove',{
                    detail:{
                        from: parent
                    }
                });

               components.map((el)=>{
                    
                    el.dispatchEvent(removeEvent);
               });

               element.dispatchEvent(removeEvent);
            }

            if(target.parentElement){

               let parent = target.parentNode;
    
               let targetComponents = getAllComponents(target);

               let removeEvent = new CustomEvent('adarna-on-remove',{
                    detail:{
                        from: parent
                    }
               });

               targetComponents.map((el)=>{
                    
                    el.dispatchEvent(removeEvent);
               });

     
               target.dispatchEvent(removeEvent);
            }

            target.replaceWith(element);

            let mountEvent = new CustomEvent('adarna-on-mount');

            element.dispatchEvent(mountEvent);
           
            let isInPage = (element === document.body) ? false : document.body.contains(element);

            if(isInPage){  
                
                let onPageEvent = new CustomEvent('adarna-on-page');

                element.dispatchEvent(onPageEvent);
                components.map((el)=>{  
                    el.dispatchEvent(onPageEvent);
                });
            }
        }
    }
}

function render(element){

    return {
        to: function(target){

            let removeEvent = new CustomEvent('adarna-on-remove',{
                detail:{
                    from: target
                }
            });
            
            getAllComponents(target).map((el)=>{
                
                el.dispatchEvent(removeEvent);
            });

            target.innerHTML = '';

            let mountEvent = new CustomEvent('adarna-on-mount',{detail:6});

            target.appendChild(element);

            element.dispatchEvent(mountEvent);

            let isInPage    = (element === document.body) ? false : document.body.contains(element);
                
            if(isInPage){
                let onPageEvent = new CustomEvent('adarna-on-page');
            
                element.dispatchEvent(onPageEvent);

                getAllComponents(element).map((el)=>{  
                    el.dispatchEvent(onPageEvent);
                });
            }
        }
    }
}

function domReady(callback){
    
    let cb = ()=>{
        callback();
        window.removeEventListener('load',cb);
    }

    if(document.readyState === 'complete'){
        cb();
    }else{
        window.addEventListener('load',cb);
    }
}

function syncAttr(a,b){
       
    let attrs       = b.attributes;
    let collection  = [];

    //Add new attributes
    for(let i = 0; i <= attrs.length - 1; i++) {

       if(a.attributes){
           
           log('syncDom: Node ('+a.tagName.toLowerCase()+') has attributes');
                
           if(a.getAttribute(attrs[i].name) != attrs[i].value){

                  
                if(attrs[i].name == 'value'){
                    
                    log('syncDOM: Value change ('+a.tagName.toLowerCase()+') "'+attrs[i].name+'" from '+a.value+' to "'+attrs[i].value+'"');
                
                    a.value = attrs[i].value;      
                }
                
                log('syncDOM: Attribute change ('+a.tagName.toLowerCase()+') "'+attrs[i].name+'" from '+a.getAttribute(attrs[i].name)+' to "'+attrs[i].value+'"');
                
                a.setAttribute(attrs[i].name,attrs[i].value);
                
           }

       }else{

            log('syncDOM: Node ('+a.tagName.toLowerCase()+') has no attributes');
           
            if(attrs[i].name == 'value'){
               
                log('syncDOM: Value change ('+a.tagName.toLowerCase()+') "'+attrs[i].name+'" from '+a.value+' to "'+attrs[i].value+'"');
                
               a.value = attrs[i].value;
            }

            log('syncDOM: Attribute change ('+a.tagName.toLowerCase()+') "'+attrs[i].name+'" from '+a.getAttribute(attrs[i].name)+' to "'+attrs[i].value+'"');
                
            a.setAttribute(attrs[i].name,attrs[i].value); 
            
       }

       collection.push(attrs[i].name);
    }//for

    //Remove attributes
    if(a.attributes){

        if(a.attributes.length > attrs.length){


            Array.from(a.attributes).map(item=>{

                if(!collection.includes(item.name)){

                    log('syncDOM: Node ('+a.tagName.toLowerCase()+') removed attribute '+item.name);
                    a.removeAttribute(item.name);
                }
            });
        }//if

    }//if

}//syncAttr()


let debug = false;

function syncDOM(oldDOM,newDOM,callback){

   
    if(newDOM.tracer){
        debug = true;
    }

    //Clone of New DOM
    let cloneDOM = newDOM.cloneNode(true);

    //Children of New DOM
    let children_of_new_DOM         = Array.from(newDOM.childNodes);

    //Children of Cloned New DOM
    let children_of_cloned_new_DOM  = Array.from(cloneDOM.childNodes);

    //Children of Old DOM
    let children_of_old_DOM         = Array.from(oldDOM.childNodes);

    //initialize callback
    callback = callback || function(){};

    //Component name and id holders
    let aID             = null;
    let bID             = null;
    let aComponentName  = null;
    let bComponentName  = null;

    if(children_of_cloned_new_DOM.length >= children_of_old_DOM.length){

        if(debug){
            debugger;
        }

        log('syncDOM: New template ('+newDOM.tagName.toUpperCase()+') has more or equal nodes than old template ('+oldDOM.tagName.toUpperCase()+')');
        
        for(let i = 0 ;i <= children_of_cloned_new_DOM.length - 1; i++){
        
            let oldItem     = children_of_old_DOM[i] || null;
            let clonedItem  = children_of_cloned_new_DOM[i];
            let newItem     = children_of_new_DOM[i];
            
           
            if(oldItem){

                if(debug){
                    debugger;
                }
                
                //NEW
                if(clonedItem.nodeName != '#text'){
                    aID             = clonedItem.getAttribute('data-component-id');
                    aComponentName  = clonedItem.getAttribute('data-component-name');
                }

                //OLD
                if(oldItem.nodeName != '#text'){
                    bID             = oldItem.getAttribute('data-component-id');
                    bComponentName  = oldItem.getAttribute('data-component-name');
                }
                
                if(
                    //Old Element is replaced by Component
                    (bID == null && aID != null) ||
                    (bID != null && aID == null)
                ){
                    log('syncDOM: A Component ('+oldItem.getAttribute('data-component-name')+' - '+oldItem.tagName.toLowerCase()+' - '+oldItem.getAttribute('data-component-id')+') is replaced with ('+newItem.getAttribute('data-component-name')+' - '+newItem.tagName.toLowerCase()+' - '+newItem.getAttribute('data-component-id')+')');
                    
                    if(debug){
                        debugger;
                    }
                    
                    replaceEl(oldItem).with(newItem);
                
                }else if( 
                    //Component is replace by a different component
                    (aComponentName != null && bComponentName != null) && 
                    (aComponentName != bComponentName)
                ){ 
                    log('syncDOM: B Component ('+oldItem.getAttribute('data-component-name')+' - '+oldItem.tagName.toLowerCase()+' - '+oldItem.getAttribute('data-component-id')+') is replaced with ('+newItem.getAttribute('data-component-name')+' - '+newItem.tagName.toLowerCase()+' - '+newItem.getAttribute('data-component-id')+')');
                    
                    if(debug){
                        debugger;
                    }
                    
                    replaceEl(oldItem).with(newItem);

                }else if( 
                    //Component is replace by same Component different ID
                    (aComponentName != null && bComponentName != null) &&
                    (aComponentName == bComponentName) &&
                    (aID != bID)
                ){
                   
    
                    log('syncDOM: C Component ('+oldItem.getAttribute('data-component-name')+' - '+oldItem.tagName.toLowerCase()+' - '+oldItem.getAttribute('data-component-id')+') is replaced with ('+newItem.getAttribute('data-component-name')+' - '+newItem.tagName.toLowerCase()+' - '+newItem.getAttribute('data-component-id')+')');
                    
                    if(debug){
                        debugger;
                    }
                    
                    replaceEl(oldItem).with(newItem);
                
                    
                }else if(clonedItem.nodeName != oldItem.nodeName){
                    
                    log('syncDOM: Node '+oldItem.nodeName+' is replaced with '+newItem.nodeName);
                    
                    if(debug){
                        debugger;
                    }
                    
                    replaceEl(oldItem).with(newItem);

                }else if(oldItem.nodeName != '#text' && clonedItem.nodeName != '#text'){
                    
                    if(debug){
                        debugger;
                    }
                    
                    //Sync Attribues    
                    syncAttr(oldItem,clonedItem);

                    //if there are still child nodes then sync again
                    if(clonedItem.childNodes.length || oldItem.childNodes.length){
                        
                        if(debug){
                            debugger;
                        }
                        
                        log('syncDOM: Resyncing '+oldItem.tagName.toLowerCase()+' to '+newItem.tagName.toLowerCase());
                        syncDOM(oldItem,newItem);
                    }

                }else{

                    //Sync Text Nodes
                    if(clonedItem.nodeValue != oldItem.nodeValue){

                        if(debug){
                            debugger;
                        }
                        
                        log('syncDOM: Text node value "'+oldItem.nodeValue+'" to "'+newItem.nodeValue+'"');
                        oldItem.nodeValue = newItem.nodeValue;
                    }

                } //else

            }else{ //Node does not yet exists

                if(debug){
                    debugger;
                }
                
                log('syncDOM: Append '+newItem.tagName.toLowerCase()+' to '+oldDOM.tagName.toLowerCase());
                appendEl(newItem).to(oldDOM);
            }
            
        }//forloop    
            
        
    }else{
      
        log('syncDOM: Old template ('+oldDOM.tagName.toUpperCase()+') has more nodes than new template ('+newDOM.tagName.toUpperCase()+')');

    
        if( 
            (oldDOM.getAttribute('data-component-id') != null || newDOM.getAttribute('data-component-id') != null) &&
            (oldDOM.getAttribute('data-component-id') == newDOM.getAttribute('data-component-id')) && 
            !newDOM.parentNode.isParentFragment
        ){
            
            if(debug){
                debugger;
            }


            log('syncDOM: Component ('+oldDOM.getAttribute('data-component-name')+' - '+oldDOM.tagName.toLowerCase()+' - '+oldDOM.getAttribute('data-component-id')+') is replaced with ('+newDOM.getAttribute('data-component-name')+' - '+newDOM.tagName.toLowerCase()+' - '+newDOM.getAttribute('data-component-id')+')');
            
            if(debug){
                debugger;
            }
            
            replaceEl(oldDOM).with(newDOM);
        
        }else{
        
            if(debug){
                debugger;
            }
            
            for(let i = 0 ;i <= children_of_old_DOM.length - 1; i++){
                
                let oldItem     = children_of_old_DOM[i];
                let clonedItem  = children_of_cloned_new_DOM[i] || null;
                let newItem     = children_of_new_DOM[i] || null;

                if(clonedItem){   
                    
                    if(debug){
                        debugger;
                    }
                    
                    //New
                    if(clonedItem.nodeName != '#text'){
                        aID             = clonedItem.getAttribute('data-component-id');
                        aComponentName  = clonedItem.getAttribute('data-component-name');
                        
                    }

                    //Old
                    if(oldItem.nodeName != '#text'){
                        bID             = oldItem.getAttribute('data-component-id');
                        bComponentName  = oldItem.getAttribute('data-component-name');
                    }
                
                    //there is a component to element change
                    if( (bID == null && aID != null) || (bID != null && aID == null)){
                        log('syncDOM: A Component ('+oldItem.getAttribute('data-component-name')+' - '+oldItem.tagName.toLowerCase()+' - '+oldItem.getAttribute('data-component-id')+') is replaced with ('+newItem.getAttribute('data-component-name')+' - '+newItem.tagName.toLowerCase()+' - '+newItem.getAttribute('data-component-id')+')');
                        if(debug){
                            debugger;
                        }
                        
                        replaceEl(oldItem).with(newItem);

                    }else if(
                        //Component to different component change
                        aComponentName != bComponentName
                    ){
                        log('syncDOM: B Component ('+oldItem.getAttribute('data-component-name')+' - '+oldItem.tagName.toLowerCase()+' - '+oldItem.getAttribute('data-component-id')+') is replaced with ('+newItem.getAttribute('data-component-name')+' - '+newItem.tagName.toLowerCase()+' - '+newItem.getAttribute('data-component-id')+')');
                        if(debug){
                            debugger;
                        }
                        
                        replaceEl(oldItem).with(newItem);

                    }else if(
                        //The same component but different id 
                        (aID || bID) && (bID != aID) && 
                        (aComponentName == bComponentName)
                    ){
                        

                        log('syncDOM: C Component ('+oldItem.getAttribute('data-component-name')+' - '+oldItem.tagName.toLowerCase()+' - '+oldItem.getAttribute('data-component-id')+') is replaced with ('+newItem.getAttribute('data-component-name')+' - '+newItem.tagName.toLowerCase()+' - '+newItem.getAttribute('data-component-id')+')');
                        if(debug){
                            debugger;
                        }
                        
                        replaceEl(oldItem).with(newItem);

                    }else if(clonedItem.nodeName != oldItem.nodeName){ //If node Type is different
                       
                        log('syncDOM: Node '+oldItem.tagName.toLowerCase()+' is replaced with '+newItem.tagName.toLowerCase());
                        if(debug){
                            debugger;
                        }
                        
                        replaceEl(oldItem).with(newItem);
                       
                    }else if(clonedItem.nodeName != '#text' && oldItem.nodeName != '#text'){

                        if(debug){
                            debugger;
                        }
                        
                        //Sync Attribues    
                        syncAttr(oldItem,newItem);

                        if(clonedItem.childNodes.length || oldItem.childNodes.length){
                            if(debug){
                                debugger;
                            }
                            
                            log('syncDOM: Resynching '+oldItem.tagName.toLowerCase()+' to '+newItem.tagName.toLowerCase());
                            
                            syncDOM(oldItem,newItem);
                        }
       
                             
                    }else{

                        if(debug){
                            debugger;
                        }
                        
                        //Sync Text Nodes
                        if(oldItem.nodeValue != clonedItem.nodeValue){

                            if(debug){
                                debugger;
                            }
                            
                            log('syncDOM: Text node value "'+oldItem.nodeValue+'" to "'+newItem.nodeValue+'"');
                        
                            oldItem.nodeValue = newItem.nodeValue;
                        }
                    } 

                }else{

                    if(debug){
                        debugger;
                    }
                    
                    log('syncDOM: Remove node '+oldItem.tagName.toLowerCase());
                    removeEl(oldItem); 

                }//ifelse

            }//forloop
        }
    }//ifelse
        

    callback(oldDOM);

    return oldDOM;
}




class Signal{

    constructor(){
        
        if(typeof window.AdarnaSignalRegistry == 'undefined'){
            window.AdarnaSignalRegistry = {};    
        }

        this.receiverRegistry = {};
    }

    broadcast(key,data,receiver){


        if(typeof AdarnaSignalRegistry[key] != 'undefined'){

     
            AdarnaSignalRegistry[key].map(obj=>{
                
                if(obj.signal == this) return false;

                let reply = obj.callback(data,this);

                if(typeof receiver == 'function'){

                    receiver({
                        data:reply,
                        signal:obj.signal
                    });
                }
                
            });
        }

        return true;
    }

    receiver(key,callback){

        let obj = {
            callback:callback,
            signal: this
        }

        if(typeof this.receiverRegistry[key] == 'undefined'){
            this.receiverRegistry[key] = obj;
        }else{

            throw 'Signal receiver "'+key+'" has already been initialized';
            return false;
        }

        if(typeof AdarnaSignalRegistry[key] == 'undefined'){
            AdarnaSignalRegistry[key] = [obj];
        }else{
            AdarnaSignalRegistry[key].push(obj);
        }

        return {
            close: ()=>{

                //Global
                let i = AdarnaSignalRegistry[key].indexOf(obj);

                AdarnaSignalRegistry[key].splice(i,1);

                if(!AdarnaSignalRegistry[key].length){
                    delete AdarnaSignalRegistry[key];
                }

                //Local
                delete this.receiverRegistry[key];
                
            }
        }
    }

    closeAllReceivers(){

        for(let key in this.receiverRegistry){

            let obj = this.receiverRegistry[key];
             //Global
            let i = AdarnaSignalRegistry[key].indexOf(obj);


            if(i > 0){
                AdarnaSignalRegistry[key].splice(i,1);

                if(!AdarnaSignalRegistry[key].length){
                    delete AdarnaSignalRegistry[key];
                }  
            }
          

            //Local
            delete this.receiverRegistry[key];
            

        };

        return true;
    }
}

class Template {

    constructor(){

        //Setup private variables
        let content = document.createDocumentFragment();
        let og      = content;

        content.isParentFragment = true

        /** Setup private methods **/

        //Create stylesheet values for attribute style
        const toCSS   = function(param){ 

            if(Array.isArray(param)){

                let obj = {};
                param.map(item=>{
                    obj = Object.assign(obj,item);
                });

                param = obj;
            }

            let style = [];

            for(let key in param){

                let dashed = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                style.push(dashed+':'+param[key]);
            }

            return style.join(';');
        };

        //Apply attributes to element
        const applyAttributes = function(el,param){
           
            for(var key in param){

                if(key == 'style'){
                    param[key] = toCSS(param[key]);
                }

                let text = document.createTextNode(param[key]);
                let dummy = document.createElement('p');
                dummy.appendChild(text);
                
                let dashed = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                el.setAttribute(dashed,dummy.innerText);
                    
                   
            }  
           
        };

        //Start element
        const start = function(el){
            content = el;
        };

        //Ending element
        const end = function(el){
            content = el.parentElement || og;
        };

        //Setup elements with attributes and custom methods
        const processElement = function(type,param,callback){
           
            let el = null;
            
            if(typeof type == 'object'){
                el = type;
            }else {

                if(type == 'frag'){
                    el = document.createDocumentFragment();
                }else if(type == 'component'){
                    el = callback;
                }else{
                    el = document.createElement(type);
                }
            }
     
            if(typeof param == 'object'){
                applyAttributes(el,param);
            }else if(typeof param == 'string'){
                el.innerHTML = param;
            }else if(typeof param == 'function'){
                callback = param;
            }


            el.template = {};

            el.template.append = function(elem){
                appendEl(elem).to(el);
            }

            el.template.remove = function(elem){
                removeEl(elem).to(el);
            }


            el.template.text = function(val){
                let dummy = document.createElement('p');
                dummy.textContent = val;
                el.innerHTML = dummy.innerHTML;
            };
            

            el.template.observe = function(config){

                let callback =[];

                let observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        callback.map( (cb) =>{ 
                            cb(mutation,observer); 
                        });
                    });
                });
                
                
                observer.observe(el,config);


                return {
                    on:function(cb){
                        callback.push(cb);
                        return {
                            off:()=>{
                                let i = callback.indexOf(cb);
                                callback.splice(i,1);
                            }    
                        };
                    },
                    disconnect: function(){
                        observer.disconnect();
                    },
                    takeRecords: function(){
                        observer.takeRecords();
                    }
                };
            };

            el.template.shadow = function(mode,dom){
                appendEl(dom).to(el.attachShadow({mode:mode}));
            };


            el.template.bindTo = function(target,variableName){
                
                return {
                    as: (name)=>{
    
                        variableName = variableName ?? 'el';
    
                        if(typeof target[variableName] == 'undefined'){
                            target[variableName] = {};
                        }
    
                        target._resetBindedVariables[variableName] = name;
                        
                        el.setAttribute('data-has-bindings',true);

                        el.template.onBind = ()=>{
                            target[variableName][name] = el;
                        }
    
                        return el;
                    },
    
                    asArray: (name)=>{
    
                        variableName = variableName ?? 'elArr';
    
                        if(typeof target[variableName] == 'undefined'){
                            target[variableName] = {};
                        }
    
                        if(!Array.isArray(target[variableName][name])){
                            target[variableName][name] = []
                        }
    
                        target._resetBindedVariables[variableName] = name;
                        
                        el.setAttribute('data-has-bindings',true);
                        

                        el.template.onBind = ()=>{
                          
                            if(!target[variableName][name].includes(el)){
                                target[variableName][name].push(el);
                            }
                           
                        }
    
                        return el;
                    }
                };
           
            }

            //Append element to content
            appendEl(el).to(content);
           

            if(typeof callback == 'function'){
               
                //Arrange elements in correct order
                start(el);
                    callback(el);
                end(el);
               
            }else if(typeof callback == 'string'){

                 //Arrange elements in correct order
                 start(el);

                    let t = document.createTextNode(callback);
            
                    content.appendChild(t);
 
                 end(el);
            }

           
            return el;
        };

        /** Setup public methods which have access to private methods **/
        
        //List of HTML tags
        let tags = [
            "a",
            "abbr",
            "acronym",
            "address",
            "applet",
            "area",
            "article",
            "aside",
            "audio",
            "b",
            "base",
            "basefont",
            "bdi",
            "bdo",
            "bgsound",
            "big",
            "blink",
            "blockquote",
            "body",
            "br",
            "button",
            "canvas",
            "caption",
            "center",
            "cite",
            "code",
            "col",
            "colgroup",
            "content",
            "data",
            "datalist",
            "dd",
            "decorator",
            "del",
            "details",
            "dfn",
            "dir",
            "div",
            "dl",
            "dt",
            "element",
            "em",
            "embed",
            "fieldset",
            "figcaption",
            "figure",
            "font",
            "footer",
            "form",
            "frame",
            "frameset",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "head",
            "header",
            "hgroup",
            "hr",
            "html",
            "i",
            "iframe",
            "img",
            "input",
            "ins",
            "isindex",
            "kbd",
            "keygen",
            "label",
            "legend",
            "li",
            "link",
            "listing",
            "main",
            "map",
            "mark",
            "marquee",
            "menu",
            "menuitem",
            "meta",
            "meter",
            "nav",
            "nobr",
            "noframes",
            "noscript",
            "object",
            "ol",
            "optgroup",
            "option",
            "output",
            "p",
            "param",
            "plaintext",
            "pre",
            "progress",
            "q",
            "rp",
            "rt",
            "ruby",
            "s",
            "samp",
            "script",
            "section",
            "select",
            "shadow",
            "small",
            "source",
            "spacer",
            "span",
            "strike",
            "strong",
            "sub",
            "summary",
            "sup",
            "svg",
            "path",
            "table",
            "tbody",
            "td",
            "template",
            "textarea",
            "tfoot",
            "th",
            "thead",
            "time",
            "title",
            "tr",
            "track",
            "tt",
            "u",
            "ul",
            "var",
            "video",
            "wbr",
            "xmp"
        ];

        //Attach HTML tags as methods
        tags.map( (name)  => {
            this[name] = function(param,callback){
                return processElement(name,param,callback);
            };
            //Compile content to a dom fragment and clear content
        });



        //Strange hack to prevent users from overiding main methods
        let dum = [1];
        dum.map(()=>{

            //Setup method for textNode
            this.txt = function(value){
                var t = document.createTextNode(value);
            
                content.appendChild(t);

                return t;
            };

            this.component = function(param,component){

                if(typeof component == 'undefined'){
                    content.appendChild(param);
                    return param;
                }

                applyAttributes(component,param);

                content.appendChild(component);

                return component;
            }

            //Setup method for documentFragment
            this.frag = function(callback){
                return processElement('frag',{},callback);
            };

            //Setup method for style tag
            this.style = function(css){
            
                //var style = processComponent('style',{},()=>{});
                var style = processElement('style',{},()=>{});
                let stylesheet = "\n";

                //Prepare stylesheet
                Object.keys(css).map((selector) => {

                    //Free text mode
                    if(selector == '--'){
                        
                        stylesheet += css[selector]+"\n";

                    }else {

                        //Key value pair mode
                        stylesheet += "["+styleScope+"] "+selector+" {\n";

                            for(let key in css[selector]){
                                stylesheet += "\t"+key+':'+css[selector][key]+";\n";
                            }
                        
                        stylesheet += "} \n\n";
                    }
                });

                //Setup stylesheet
                style.innerHTML = stylesheet;
            
                return style;
            };

            //Create method to handle dom elements and string input
            this.el = function(el,param,callback){
            
                if(typeof el == 'string'){

                    let div = document.createElement('div');

                    div.innerHTML= el.trim();

                    el = div;
                }

                return processElement(el,param,callback);
            };

            //Method to define element and add custom element as method to template
            this.defineElement = function(name, options, constructor){
            
                customElements.define(name, constructor, options);
            
                this[ name.replace(/\-/g,'_') ] = function(param,callback){
                    return processElement(name,param,callback);
                }; 

            };

            //Compile dom
            this.compile = function(){
                let buffer = content;
                content = document.createDocumentFragment();
                og = content;
                return buffer;
            };

            //Helper functions
            this.helper = {
                htmlEscape:(val)=>{
                    let text = document.createTextNode(val);
                    let dummy = document.createElement('p');
                    dummy.appendChild(text);
        
                    return dummy.innerText;
                }
            };
        });
     
      
     }


     //Helper method to extract the parameters & the callback from the method's arguments
     reduce(args){

        args[0] = args[0] || {};
        args[1] = args[1] || null;
       
        let _param = {};
        let _cb = function(){};

        if(typeof args[0] == 'function'){
            _cb = args[0];

        }else {
            _param = args[0];
        }
        
        if(typeof args[1] == 'function'){
            _cb = args[1];
        }

        _cb.bind(this);

        return {
            callback: _cb,
            param:_param
        }
    }

}

function linkCSS(href){

    let test = document.querySelector('link[href="'+href+'"]');

    if(test){
        return false;
    }

    let link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('href',href);

    document.querySelector('head').appendChild(link);

    return link;
}

function linkScopedCSS(scopename,href){

    let test = document.querySelector('style[data-href="'+href+'"]');

    if(test){

        if(test.getAttribute('data-adarna-css-scope') == scopename){
            return false;   
        }
    }

    let style = document.createElement('style');

    style.setAttribute('data-href',href);
    style.setAttribute('data-adarna-css-scope',scopename);

    let promise = fetch(href)
    .then(response => response.text())
    .then((text)=>{
        text.replaceAll('$','['+scopename+']');
        document.querySelector('body').appendChild(style);

        return style;

    });      


    return {
        promise: promise,
        element: style
    };   
}


class Watcher{

    constructor(obj){

        let target       = this.processObject(obj);
        this.subscribers = [];

        return {
            subscribe: (key,callback)=>{
               return this.subscribe(key,callback);
            },
            unsubscribe:(index)=>{
                return this.unsubscribe(index);
            },
            target: target
        }
    }

    subscribe(key,callback){

        this.subscribers.push({
            key: key,
            callback:callback
        });

        return this.subscribers.length-1;
    }

    unsubscribe(key){

        if(typeof this.subscribers != 'undefined'){
            this.subscribers[key] = null;
        }
    }

    processObject(obj,path){

        let proxied = {};

        
        path = (typeof path == 'undefined' || path == null) ? '' : path;        
        
        for(let key in obj){


            if(typeof obj[key] == 'object'){

                proxied[key] = this.processObject(obj[key],[path,key].filter((item)=>{ return (item != ''); }).join('/'));
            }else{

                proxied[key] = obj[key];   
            }
        }

        let result = new Proxy(proxied, {
          get:  (target, key, receiver) => {

            return Reflect.get(target, key, receiver);
          },
          set:  (target, key, value, receiver) => {

            let keyPath = [path,key].filter((item)=>{ return (item != ''); }).join('/');
        
            this.subscribers.map(item => {
                
                if(item != null){

                    if(item.key == keyPath){
                        item.callback(value,target[key]);
                    }    
                }
                
            });

            return Reflect.set(target, key, value, receiver);
          }   
        });

        return result;
    }

}


function objToCSS(obj,scope){

    let style   = '';
    scope       = (typeof scope == 'undefined') ? '' : scope;

    for(let key in obj){

       
        if(/^@media\s/.test(key)){  //Media
            
            style += key+"{\n";
            
              for(let opt in obj[key]){

                    let properties = obj[key][opt];

                    style += "\t[data-component-name='"+scope+"'] "+opt+" {\n";


                        //If object
                        if(typeof properties == 'object'){

                            for(let name in properties){

                                let value   = properties[name];
                                name        = name.replace(/[A-Z]/g, m => "-" + m.toLowerCase());

                                style += "\t\t"+name+" : "+value+";\n";  
                            }

                        }else{ //if string

                            style += properties+"\n";
                        }


                    style += "\t}\n\n";

                }

            style += "}\n\n";

        }else if(/^@keyframes\s/.test(key)){  //Keyframes

            style += key+"{\n";
            
              for(let opt in obj[key]){

                    let properties = obj[key][opt];

                    style += "\t"+opt+" {\n";


                        //If object
                        if(typeof properties == 'object'){

                            for(let name in properties){

                                let value   = properties[name];
                                name        = name.replace(/[A-Z]/g, m => "-" + m.toLowerCase());

                                style += "\t\t"+name+" : "+value+";\n";  
                            }

                        }else{ //if string

                            style += properties+"\n";
                        }


                    style += "\t}\n\n";

                }

            style += "}\n\n";

        }else{ //Regular CSS
        

            style += "[data-component-name='"+scope+"'] "+key+" {\n";

            let properties = obj[key];

            //If object
            if(typeof properties == 'object'){

                for(let name in properties){

                    let value   = properties[name];
                    name        = name.replace(/[A-Z]/g, m => "-" + m.toLowerCase());

                    style += "\t"+name+" : "+value+";\n";  
                }

            }else{ //if string

                style += properties+"\n";
            }


            style += "}\n\n";
        }
    }

    return style;
}


function isFromDifferentComponent(item,id){

    let parent = item.parentNode ?? false;
    
    if(parent){

        let pid = parent.getAttribute('data-component-id');
    
        if(!pid){
    
            return isFromDifferentComponent(parent,id);
        
        }else if(pid != id){
            return true;
        }
    
    }else{

        let eid = item.getAttribute('data-component-id');
        
        if(eid != id){
            return true;
        }
    }

    return false;
}

function initializeDataElements($this,dom){

    let el   = Array.from(dom.querySelectorAll('[data-el]'));
    let els  = Array.from(dom.querySelectorAll('[data-els]'));

    el.map(item=>{
        
        if(!isFromDifferentComponent(item,$this.dataId)){
            
            let name = item.getAttribute('data-el');

            $this.el[name] = item;

        }
    
    });

    els.map(item=>{

        if(!isFromDifferentComponent(item,$this.dataId)){
            let name = item.getAttribute('data-els');

            if(typeof data[name] == 'undefined'){
                $this.els[name] = [];
            }

            $this.els[name].push(item);
        }
    });

}


function initializeElementValues($this,dom){

    let els = Array.from(dom.querySelectorAll('input,select,textarea'));

    for(let i = 0; i <= els.length - 1; i++){

        let name =  els[i].name;

        if(!name) continue;

        $this.val[name] = (type)=>{

            let elArr = Array.from(dom.querySelectorAll('[name="'+name+'"]'));

            //Return value if only one
            if(elArr.length == 1) return elArr[0].value;

            let result = [];

            elArr.map(itm =>{
                if(itm.value){
                    result.push(itm.value);
                }
            });

            //If no result
            if(!result.length) return '';

            //If only one result
            if(result.length == 1) return result[0];

            //Return array of result
            if(typeof type == 'undefined'){
                return result;
            }else if(type == true){ //Get only first value of result
                return result[0];
            }else if (type == false){ //Get only last value result
                return result[result.length-1];
            }
        }
    }
}

function initializeBindings(dom){

    if(typeof dom['component'] != 'undefined'){

        if(typeof dom['component']['onBind'] != 'undefined'){
            dom.component.onBind();
        }

    }else if(typeof dom['template'] != 'template'){

        if(typeof dom['template']['onBind'] != 'undefined'){
            dom.template.onBind();
        }
    }

    let decendants = Array.from(dom.querySelectorAll('[data-has-bindings]'));
    
    decendants.map(el=>{
       
        if(typeof el['component'] != 'undefined'){
            if(typeof el['component']['onBind'] == 'function'){
                el.component.onBind();
            }
        }else if(typeof el['template'] != 'undefined'){
            if(typeof el['template']['onBind'] == 'function'){
                el.template.onBind();
            }
        }
    });
}

class Component {

    constructor(data){

        this.el                     = {};
        this.els                    = {};
        this.val                    = {};
        this._resetBindedVariables  = {};
        this.model                  = this.model();

  
        if(typeof data != 'undefined'){
            for(let key in this.model){

                if(typeof data[key] != 'undefined'){
                    this.model[key] = data[key];
                }
            }    
        }

        this.init();

        let componentName               = this.constructor.name;
        let checkIfStyleAlreadyExists   = document.querySelector('style[data-component-style="'+componentName+'"]');
        let styleObj                    = this.style();
       // let dataEl                      = {};

        if(styleObj && !checkIfStyleAlreadyExists){

            let styleEl = document.createElement('style');
            
            styleEl.setAttribute('data-component-style',componentName);
            styleEl.innerHTML = objToCSS(styleObj,componentName);

            document.body.appendChild(styleEl);
        }

        
        for(let key in this._resetBindedVariables){
            delete this[key][ this._resetBindedVariables[key] ];
        };

        this.onBeforeRender();
        
        let dom = this.view();
       
        this.dataId = uuidv4();

        dom.setAttribute('data-component-id',this.dataId);
        dom.setAttribute('data-component-name',componentName);
        dom.classList.add('adarna-component');
        //TODO check for correct return of dom

        dom.component   = {};
        dom.handler     = {};
        


        initializeDataElements(this,dom);
        initializeElementValues(this,dom);
        initializeBindings(dom);

        this.controller(dom);
        
        
        this.update = (name,data,callback)=>{
        
            if(typeof name != 'undefined' && (typeof data == 'undefined' || data == null)){
                
                for(let key in this.model){
                    if(typeof name[key] != 'undefined'){
                        this.model[key] = name[key];    
                    }
                }

            }else if(typeof data != 'undefined' && typeof this.model[name] != 'undefined'){
                this.model[name] = data; 
            }   

            for(let key in this._resetBindedVariables){
            
                delete this[key][ this._resetBindedVariables[key] ];
    
            };
            
            this.onBeforeRender();

            let newDOM = this.view();

            newDOM.setAttribute('data-component-id',this.dataId);
            newDOM.setAttribute('data-component-name',componentName);
            
            dom = syncDOM(dom,newDOM,callback);
            
            initializeDataElements(this,dom);
            initializeElementValues(this,dom);
            initializeBindings(dom);
            
            this.controller(dom);
            
        };//this.update()


        
        dom.component.update = (name,data,callback)=>{
            
            this.update(name,data,callback);
        };

        dom.component.getModel = ()=>{
            return this.model;
        }

        let onMountFlag = false;
        let onPageFlag  = false;

        dom.addEventListener('adarna-on-mount',(ev)=>{

            if(onMountFlag) return false;

            onMountFlag = true;

            this.onMount(ev);
        });
        
        dom.addEventListener('adarna-on-remove',(ev)=>{

            if(!onMountFlag) return false;

            onMountFlag = false;
            
            this.onRemove(ev);
        });

        dom.addEventListener('adarna-on-page',(ev)=>{

            if(onMountFlag && onPageFlag) return false;

            onPageFlag = true;

            this.onPage(ev);
        });

        dom.component.getState = ()=>{
            return {
                onMount: onMountFlag,
                onPage: onPageFlag
            }
        }

        dom.component.bindTo = (target,variableName)=>{
            
            return {
                as: (name)=>{

                    variableName = (typeof variableName == 'undefined') ? 'el' : variableName;

                    if(typeof target[variableName] == 'undefined'){
                        target[variableName] = {};
                    }

                    target._resetBindedVariables[variableName] = name;

                    dom.setAttribute('data-has-bindings',true);

                    dom.component.onBind = ()=>{
                        target[variableName][name] = dom;
                    }

                    return dom;
                },

                asArray: (name)=>{

                    variableName = (typeof variableName == 'undefined') ? 'els' : variableName;

                    if(typeof target[variableName] == 'undefined'){
                        target[variableName] = {};
                    }

                    if(!Array.isArray(target[variableName][name])){
                        target[variableName][name] = []
                    }

                    target._resetBindedVariables[variableName] = name;

                    dom.setAttribute('data-has-bindings',true);
                    
                    dom.component.onBind = ()=>{
                        if(!target[variableName][name].includes(dom)){
                            target[variableName][name].push(dom);
                        }
                    }

                    return dom;
                }
            };

        }

        return dom;
    }

    init(){}

    model(){
        return {}
    }

    view(){
        return document.createElement('div');
    }

    controller(){}

    style(){
        return {};
    }

    onBeforeRender(){}
    onMount(ev){}
    onRemove(ev){}
    onPage(ev){}
    onStateChange(state,oldState){}
}


function objStructure(struct,obj){

    obj = (typeof obj == 'object') ? obj : {};

    let newObj = {};

    for(let key in struct){

        if(typeof struct[key] != 'object'){
            newObj[key] = (typeof obj[key] == 'undefined') ? struct[key] : obj[key];
        }else{
            newObj[key] = objStructure(struct[key],obj[key]);
        }
    }

    return newObj;
}

function touchInterface(elem){

    let $this = {};

    $this.draggable = (opt) => {


        opt = objStructure({
            x: true,
            y: true,
            autoOn: true,
            cursorHover:'grab',
            cursorHold:'grabbing',
            zIndex: 9999,
            onStart: ()=>{ return true; },
            onMove: ()=>{},
            onEnd: ()=>{},
            xRange:(x)=>{ return x;},
            yRange:(y)=>{ return y;}
        },opt);

        const ogZIndex = elem.style.zIndex;

        /*****************************************************
        |  credits to https://www.kirupa.com/html5/drag.htm
        *****************************************************/
        let active      = false;
        let currentX    = null;
        let currentY    = null;
        let initialX    = null;
        let initialY    = null;
        let offsetX     = 0;
        let offsetY     = 0;


        const dragStart = (e) => {
          
          elem.style.zIndex = opt.zIndex;

          if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - offsetX;
            initialY = e.touches[0].clientY - offsetY;
          } else {
            initialX = e.clientX - offsetX;
            initialY = e.clientY - offsetY;
          }

          if (e.target === elem) {
            
            active = opt.onStart(e,{
                initialX: initialX,
                initialY: initialY,
                currentX: currentX,
                currentY: currentY,
                offsetX: offsetX,
                offsetY: offsetY
            });
          }

          
        }

        const dragEnd = (e) => {
            
            elem.style.zIndex = ogZIndex;
          
            initialX = currentX;
            initialY = currentY;

            active = false;

            opt.onEnd(e,{
                initialX: initialX,
                initialY: initialY,
                currentX: currentX,
                currentY: currentY,
                offsetX: offsetX,
                offsetY: offsetY,
            },(x,y)=>{

                offsetX = x;
                offsetY = y;
                setTranslate(x,y,elem);
            });
        }

        const drag = (e) => {
          if (active) {
          
            e.preventDefault();
          
            if (e.type === 'touchmove') {
              currentX = (opt.x) ? e.touches[0].clientX - initialX : 0;
              currentY = (opt.y) ? e.touches[0].clientY - initialY : 0;
            } else {
              currentX = (opt.x) ? e.clientX - initialX : 0;
              currentY = (opt.y) ? e.clientY - initialY : 0;
            }

            currentX = opt.xRange( currentX );
            currentY = opt.yRange( currentY );

            offsetX = currentX;
            offsetY = currentY;

            setTranslate(currentX, currentY, elem);
            
            opt.onMove(e,{
                initialX: initialX,
                initialY: initialY,
                currentX: currentX,
                currentY: currentY,
                offsetX: offsetX,
                offsetY: offsetY
            });
          }
        }

        const setTranslate = (xPos, yPos, el) => {
          el.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
        }

        if(opt.autoOn){
          
            elem.addEventListener('mousedown',dragStart,false);
            elem.addEventListener('mousemove',drag,false);
            elem.addEventListener('mouseup',dragEnd,false); 
            elem.addEventListener('mouseout',dragEnd,false); 
            
            elem.addEventListener('touchstart', dragStart, false);
            elem.addEventListener('touchend', dragEnd, false);
            elem.addEventListener('touchmove', drag, false);
        }



        return {
            elem:elem,
            off: ()=>{
                
                elem.removeEventListener('mousedown',dragStart,false);
                elem.removeEventListener('mousemove',drag,false);
                elem.removeEventListener('mouseup',dragEnd,false); 
                elem.removeEventListener('mouseout',dragEnd,false); 
                
                elem.removeEventListener('touchstart', dragStart, false);
                elem.removeEventListener('touchend', dragEnd, false);
                elem.removeEventListener('touchmove', drag, false);
        
                
            },

            on: ()=>{

                elem.addEventListener('mousedown',dragStart,false);
                elem.addEventListener('mousemove',drag,false);
                elem.addEventListener('mouseup',dragEnd,false); 
                elem.addEventListener('mouseout',dragEnd,false); 
                
                elem.addEventListener('touchstart', dragStart, false);
                elem.addEventListener('touchend', dragEnd, false);
                elem.addEventListener('touchmove', drag, false);
            }
        }
    }

    $this.pinch = (opt)=>{

        opt = objStructure({
            onChange: ()=>{},
            autoOn: true
        },opt);

        let active              = false;
        let initialDistance     = 0;

        const touchStart = (e) => {

            if (e.type === "touchstart") {
               
                let pointCount = e.touches.length;
               
                if(pointCount >= 2){
                   
                    let x1 = e.touches[0].clientX;
                    let y1 = e.touches[0].clientY;

                    let x2 = e.touches[1].clientX;
                    let y2 = e.touches[1].clientY;

                    initialDistance = Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );

                    active = true;
                }
            }
        }

        const touchEnd = (e) => {
            active = false;
        }

        const touchMove = (e) => {
            
            console.log('moveing',active);
            if(active){

                let pointCount = e.touches.length;
                
                if(pointCount >= 2){
                    
                    let x1 = e.touches[0].clientX;
                    let y1 = e.touches[0].clientY;

                    let x2 = e.touches[1].clientX;
                    let y2 = e.touches[1].clientY;

                    let newDistance = Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
                    
                    let difference = newDistance - initialDistance;
                    let percentage = (difference / initialDistance);
                   

                    opt.onChange(e,percentage);
                
                }
                
            }
        }

        if(opt.autoOn){

            elem.addEventListener('touchstart', touchStart, false);
            elem.addEventListener('touchend', touchEnd, false);
            elem.addEventListener('touchmove', touchMove, false);
        }
      


        return {
            elem:elem,
            off: ()=>{
                
                elem.removeEventListener('touchstart', touchStart, false);
                elem.removeEventListener('touchend', touchEnd, false);
                elem.removeEventListener('touchmove', touchMove, false);
        
                
            },

            on: ()=>{

                elem.addEventListener('touchstart', touchStart, false);
                elem.addEventListener('touchend', touchEnd, false);
                elem.addEventListener('touchmove', touchMove, false);
            }
        }
    }



    return $this;
}



class ChunkUpload{

    constructor(blob,opt){

        // status -2  - offline
        // status -1  - canceled  
        // status  0  - paused
        // status  1  - ready
        // status  2  - ongoing
        // status  3  - resumed
        // status  4  - done

        // reject code 0 - File empty
        // reject code 1 - Index error
        // reject code 2 - Unkown json structure
        // reject code 3 - Server error
        // reject code 4 - Response error
        // reject code 5 - offline

        this.status = 1;

        //Define default options
        let def = {
            chunkSize:1024*1024,
            index:0,
            url:'',
            filename:'',
            settings:{
                method:'POST',
                body:null
            },
            data:{},
            constructPostDataHook:null,
            responseHook:function(response,resolve,reject){

                if(response.status == 200){
                    

                    return response.json().then(reply => {

                        if(typeof reply.status == 'undefined' || typeof reply.message == 'undefined' || typeof reply.data == 'undefined'){

                            reject({
                                code:2,
                                message:'Unknown json reply structure'
                            });
                        }

                        return reply;
                          
                    });
                        
                }else if(response.status == 500 || response.status == 503){ //Server error

                    reject({
                        code: 3,
                        message: 'Server error',
                        data: response
                    });

                }else{

                    reject({
                        code: 4,
                        message: 'Response error',
                        data: response
                    });
                }
            },
            onProgress:function(){},
            onStatusChange: function(){},
            onComplete: function(){}
        }

        //Overwrite default options
        for(let key in def){
            if(typeof opt[key] != 'undefined'){
                def[key] = opt[key];
            }
        }


        let blobSize        = blob.size;
        let mimeType        = blob.type;
        let chunkSize       = def.chunkSize;

        if(blobSize < chunkSize){
            chunkSize = blobSize;
        }

        
        let numberOfChunks  = Math.ceil(blobSize / chunkSize);
        let start           = 0;
        let chunkArr        = [];
        

        for(let i = 1; i <= numberOfChunks; i++){

            let end =  Math.min(start + chunkSize , blobSize );
            
            chunkArr.push( blob.slice(start,end) );

            start += chunkSize;
        }

        let chunkArrLength  = chunkArr.length-1;
        let token           = Math.random().toString(20).substr(2).toUpperCase(); //Create token key
        

        let p = new Promise((resolve,reject)=>{
            
            //Construct data
            this.data = {
                options: def,
                token: token,
                lastIndex: 0,
                chunks:chunkArr,
                chunkArrLength:chunkArrLength,
                mimeType: mimeType,
                fileSize:blobSize,
                chunkSize: chunkSize,
                resolve:resolve,
                reject:reject
            }  

        
            if(chunkArrLength < 0){
                
                this.data.reject({
                    code:0,
                    message:'File is empty'
                });

            }else{

                //Notify status is ready
                this.data.options['onStatusChange'](this.status);
                this.upload(0); //upload start at index 0
            }
        });

        
        return {
            pause: this.pause,
            resume: this.resume,
            cancel: this.cancel,
            getData: this.getData,
            getStatus: this.getStatus,
            promise: p
        }
    }


    upload(index){

        if(this.status == -1){ //Is Canceled
       
            return false;  
        } 

        if(this.status == 0){ //Is Paused
            
            return false;
        }


        if(this.status != 2){ //Not Ongoing
           
            this.status = 2;

            this.data.options['onStatusChange'](2);
        }


        if(index > this.data.chunkArrLength){

            this.data.reject({
                code:1,
                message:'Index error '+index+' / '+this.data.chunkArrLength
            });

            return true;
        }


        let formData = new FormData();

        for(let key in this.data.options['data']){
            formData.appendChild( key, this.data.options['data'][key] );
        }

        //Custom format of post message
        if(typeof this.data.options['constructPostDataHook'] == 'function'){

            this.data.options['constructPostData'](formData,index,this.data);

        }else{ //Default format of post message
            formData.append('total',this.data.chunkArrLength + 1);
            formData.append('index',index)
            formData.append('chunk',this.data.chunks[index]);
            formData.append('token',this.data.token);
            formData.append('filename',this.data.options['filename']);
            formData.append('filesize',this.data.fileSize);
            formData.append('chunksize',this.data.chunkSize);
            formData.append('mimetype',this.data.mimeType); 
        }
       


        this.data.options['settings'].method  ='POST';
        this.data.options['settings'].body    = formData;
        
        //Update progress
        this.data.options['onProgress']( 
             (index/this.data.chunkArrLength) * 100
        );


        //Send post message
        fetch(this.data.options['url'],this.data.options['settings']).then(response=>{

           //Intercept response
           return this.data.options['responseHook'](response,this.data.resolve,this.data.reject);

        }).then(reply=>{ //Expected response is json object


            if(reply.status == 0){

                this.data.reject({
                    code:3,
                    message:'Server Error',
                    data:reply
                });
                
            }else{ 

                if(reply.data.action == 'next'){

                    let lastIndex = parseInt(reply.data.lastIndex);

                    //Update last successful index
                    this.data.lastIndex = lastIndex;

                    //Upload next index
                    this.upload(
                        (lastIndex + 1) 
                    );    
                
                    
                }else if(reply.data.action == 'done'){

                    if(this.status != 4){

                        this.status = 4;

                        this.data.options['onStatusChange'](4);
                    }
                    
                    this.data.options['onComplete']({
                        reply:reply,
                        data:this.data
                    });
                    
                    this.data.resolve({
                        reply:reply,
                        data:this.data
                    });
                
                }else{

                    this.data.reject({
                        code:3,
                        message:'Server Error',
                        data: reply
                    });
                }
            }

        }).catch(err=>{
            
            //Error was due to offline or connectivity issues
            if(!window.navigator.onLine){

                this.status = -2;
                this.data.options['onStatusChange'](-2);

            }else{

                //Error was due to server
                this.data.reject({
                    code:3,
                    message:'Server Error',
                    data:err
                });    
            }
            
        });

        
    }
    
    puase(){

        if(this.status != 0){

            this.status = 0;

            this.data.options['onStatusChange'](0);  

            return true;
        }
        
        return false;
    } 

    resume(){

        if(this.status != 0 || this.status != -2) return false; //if status is not paused or offline

        if(this.status != 3){

            this.status = 3;
            
            this.data.options['onStatusChange'](3);    
        }

        this.upload( this.data.lastIndex ); 

        return true;
    }

    cancel(){

        if(this.status != -1){

            this.status = -1;
            
            this.data.options['onStatusChange'](-1);

            return true    
        }

        return false;
    }

    getStatus(){

        return this.status;
    }

    getData(){

        return this.data;
    }

}


function clientDebugger(callback){

    let logs = [];

    let errorListener = window.addEventListener('error', (event) => { 

        logs.push('Uncaught '+event.message+' in '+event.filename+' ('+event.lineno+':'+event.colno+')');

    });

    let hashListiner = window.addEventListener('hashchange', (e)=>{
        
        let hash = window.location.hash.substr(1);

        if(typeof callback[hash] != 'undefined'){
            callback[hash](logs);
        }

    }, false);

    
    return {
        remove: ()=>{
            window.removeEventListener(errorListener);
            window.removeEventListener(hashListiner);
        },
        log: (val)=>{

            if(typeof val != 'string'){
                val = val.toString();
            }
            
            logs.push(val);
        },
        getStackCallData:()=>{
            
            let e = new Error();
            
            if (!e.stack) {
                try {
                    // IE requires the Error to actually be thrown or else the 
                    // Error's 'stack' property is undefined.
                    throw e;
                    
                } catch (e) {
                    if (!e.stack) {
                        //return 0; // IE < 10, likely
                    }
                }
            }
            
            let stack = e.stack.toString().split(/\r\n|\n/);
            
            return stack;
        }
    }
}



function middleware(type,process){
                
    //If type is a function then type is the process
    if(typeof type == 'function'){
        process = type;
        type = true; //default type to true
    }

    let t = 'sync'
    
    //If type is false then it's asynchronus
    if(!type){
        t = 'async'
    }

    //Return middleware structured object
    return {
        type: t,
        process: process
    }
}

class Router {

    constructor(){
        
        //Singleton class, if router object already exists then return the object
        if(typeof window.__$Router != 'undefined'){
            return window.__$Router;
        }

        this.__$routesRegistry = {};
        this.__$404 = {
            callback: ()=>{},
            middleware: []
        };

        
        window.__$Router = this;

        //Listen for URL change through popstate
        window.addEventListener('popstate',  (event) => {

            setTimeout(()=>{
                this.run();
            },0);
        });//eventlistiner

    }

    setupAnchorTag(className,target){

        if(typeof target == 'undefined'){
            target = document.body;
        }

        if(typeof className != 'undefined'){

            target.addEventListener('click',(e)=>{
                
                e.preventDefault();
                
                if(e.target.tagName == 'A' && e.target.classList.contains(className)){
                    this.go(e.target.href);
                }
            });

        }else{

            target.addEventListener('click',(e)=>{
                
                e.preventDefault();
                
                if(e.target.tagName == 'A'){
                    this.go(e.target.href);
                }
            });

        }
        
    }

    on(items,middleware,callback){
        
        if(typeof items == 'string'){
            items = [items];
        }

        items.map(path=>{
            
            path = path.trim();
            
            //Uniform empty URI
            if(path == '/'){
                path = '';
            }
            
            //If first parameter is a function then set default middleware
            if(typeof middleware == 'function'){
                callback = middleware;
                middleware = [];
            }

            this.__$routesRegistry[path] = {
                middleware: middleware,
                callback: callback
            }
        });

        return this;
    }


    async run(){
        
        let path    = window.location.pathname ?? '/';
        let items   = Object.keys(this.__$routesRegistry);

        //Hack to uniform empty uri
        if(path.charAt(path.length-1) == '/'){
            path = path.substr(0,path.length-1);
        }

        //Flag to check if the route should go to 404
        let flag = false;

        //loop through routes
        for(let i = 0; i<= items.length - 1; i++){
            
            let item    = items[i];
            let orig    = item;
            item        = item.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
            //Replace "*" token
            item        = item.replaceAll('*','(.*)');
            //Replace required ":variable" token
            item        = item.replace(/\:([a-zA-Z]*)/g,'([a-zA-Z0-9]*)');
            item        = '^'+item+'$';
            
            let pattern = new RegExp(item,'i');

            //Match Route to URI
            if(!pattern.test(path)){
                continue;
            }
               
            //Get segment variables
            let segment    = {};

            if(orig.match(':')){
                
                let chunksOrig = orig.split('/');
                let chunksPath = path.split('/');

                for(let j = 0; j <= chunksOrig.length-1; j++){
                    
                    if(chunksOrig[j].charAt(0) == ':'){
                        segment[chunksOrig[j].replaceAll(':','')] = chunksPath[j];
                    }
                }
            }

            let syncMiddleware = [];
            let asyncMiddleware = [];

            //Sort sync and async middleware
            for(let i = 0; i <= this.__$routesRegistry[ orig ].middleware.length - 1; i++){
                
                if(this.__$routesRegistry[ orig ].middleware[ i ].type == 'sync'){
                    syncMiddleware.push(this.__$routesRegistry[ orig ].middleware[ i ].process);
                }else if(this.__$routesRegistry[ orig ].middleware[ i ].type == 'async'){
                    asyncMiddleware.push(this.__$routesRegistry[ orig ].middleware[ i ].process);
                }
            
            }

            //Run async middleware
            for(let j = 0; j <= asyncMiddleware.length - 1; j++){
                asyncMiddleware[ j ](segment);
            }

            //Run sync middleware
            let data = null;

            for(let k = 0; k <= syncMiddleware.length - 1; k++){
                
                let status = true;

                data = await new Promise( (resolve,reject) => {
                    
                    syncMiddleware[ k ]({
                        resolve:resolve,
                        reject:reject
                    },data,segment);

                }).catch((result)=>{
                    status = false;
                    return result;
                });

                if(status == false) return false;   
            }

            //Call the route callback
            this.__$routesRegistry[ orig ].callback(data,segment);
            
            flag = true;

            break;
           // }

        };

        //Run 404
        if(!flag){
            this.__$404.callback();
        }

    }

    go(path){
    
        history.pushState({}, '',path);

        setTimeout(()=>{

            this.run();
        },0);

        return true;
    }

    back(num){

        if(num == 0 || typeof num == 'undefined'){
            num = -1;
        }

        if(num > 0){
            num = num * -1;
        }

        window.history.go(num);
    }

    forward(num){

        if(num == 0 || typeof num == 'undefined'){
            num = 1;
        }

        if(num < 0){
            num = num * -1;
        }

        window.history.go(num);
    }

    on404(middleware, callback){
        this.__$404.callback   = callback;
        this.__$404.middleware = middleware;

        return this;
    }
}

function arrayElementRemove(arr,value){

    let index = arr.indexOf(value);

    if(index >=0){
        return arr.splice(index,1);
    }

    return arr;
}


function dateTime(Y,M,d,h,m,s){

    let _date;

    if(typeof Y == 'object'){
        _date = Y;
    }else if(Y == 'now'){
        _date = new Date();
    }else{

        Y = parseInt(Y);
        M = parseInt(M);
        d = parseInt(d);
           
        h = parseInt(h);
        m = parseInt(m);
        s = parseInt(s);

        _date = new Date(Y,M-1,d,h,m,s);
            
    }
  

    let year     = _date.getFullYear();
    let month    = _date.getMonth() + 1;
    let date     = _date.getDate();
    let hour     = _date.getHours();
    let min      = _date.getMinutes();
    let sec      = _date.getSeconds();
    let unix     = _date.getTime();
    let day      = _date.getDay();

    const dayArr = [
        {full:'Monday',short:'Mon',num:1},
        {full:'Tuesday',short:'Tue',num:2},
        {full:'Wednesday',short:'Wen',num:3},
        {full:'Thursday',short:'Thu',num:4},
        {full:'Friday',short:'Fri',num:5},
        {full:'Saturday',short:'Sat',num:6},
        {full:'Sunday',short:'Sun',num:7}
    ];

    const monthArr = [
        {full:'January',short:'Jan'},
        {full:'February',short:'Feb'},
        {full:'March',short:'Mar'},
        {full:'April',short:'Apr'},
        {full:'May',short:'May'},
        {full:'June',short:'Jun'},
        {full:'July',short:'Jul'},
        {full:'August',short:'Aug'},
        {full:'September',short:'Sep'},
        {full:'October',short:'Oct'},
        {full:'November',short:'Nov'},
        {full:'December',short:'Dec'}
    ];

    return {
        unix:()=>{
            return unix / 1000;
        },
        full:()=>{
            return year+'-'+("0"+month).slice(-2)+'-'+("0"+date).slice(-2)+' '+("0"+hour).slice(-2)+':'+("0"+min).slice(-2)+':'+("0"+sec).slice(-2);
        },
        date:()=>{
            return year+'-'+("0"+month).slice(-2)+'-'+("0"+date).slice(-2);
        },
        day:()=>{
            return dayArr[day];
        },
        time12hrs:()=>{
            return ("0"+(hour-12)).slice(-2)+':'+("0"+min).slice(-2)+':'+("0"+sec).slice(-2);
        },
        meridiem:()=>{
            if(hour > 12){
                return 'AM';
            }else{
                return 'PM';
            }
        },
        time24hrs:()=>{
            return ("0"+hour).slice(-2)+':'+("0"+min).slice(-2)+':'+("0"+sec).slice(-2);
        },
        M:()=>{
            return month;
        },
        MM:()=>{
            return ("0"+month).slice(-2);
        },
        month:()=>{
            return monthArr[month-1];
        },
        d:()=>{
            return date;
        },
        dd:()=>{
            return ("0"+date).slice(-2);
        },
        yyyy:()=>{
            return year;
        },
        h:()=>{
            return hour;
        },
        hh:()=>{
            return ("0"+hour).slice(-2);
        },
        m:()=>{
            return min;
        },
        mm:()=>{
            return ("0"+min).slice(-2);
        },
        s:()=>{
            return sec;
        },
        ss:()=>{
            return ("0"+sec).slice(-2);
        },
        increment:(type,i)=>{
            
            if(type == 'day'){
                
                _date.setDate(_date.getDate() + i);


                let yr     = _date.getFullYear();
                let mn     = _date.getMonth() + 1;
                let dt     = _date.getDate();
    
    
                return dateTime(yr,mn,dt);

            }else if(type == 'hour'){

                _date.setHours(_date.getHours() + i);


                let yr     = _date.getFullYear();
                let mn     = _date.getMonth() + 1;
                let dt     = _date.getDate();
                let hr     = _date.getHours();

                return dateTime(yr,mn,dt,hr);
            }
          
        },
        instance:()=>{
            return _date;
        }
    }
}


function $_GET(key){

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    return params[key] ?? ''; // "some_value"
      
}

export {
    ChunkUpload, 
    Component, 
    Template,
    Watcher, 
    Signal,
    Router,
    middleware,
    //clientDebugger,
    //touchInterface,
    render,
    appendEl,
    removeEl,
    replaceEl,
    cloneEl,
    domReady,
    uuidv4,
    arrayElementRemove,
    dateTime,
    $_GET
}
