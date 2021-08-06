# Adarna

Adarna is a suite of classes and functions that enable the development of web user interfaces, using purely javascript syntax.
___

## Template Class
The Template class is the primary object that is used to generate and manipulate DOM elements.


1.) The example code below will produce the corresponding HTML DOM elements:
```js
import {Template} from './adarna.js';

const t = new Template();

t.div({class:'row'},()=>{

    t.div({class:'col6'},()=>{

        t.input({type:'text',id:'username'});
    });

    t.div({class:'col6'},()=>{

        t.input({type:'password',id:'password'});

    });
});

```
Result:
```html
    <div class="row">
        <div class="col6">
            <input type="text" id="username"/>
        </div>
        <div class="col6">
            <input type="password" id="password"/>
        </div>
    </div>
```

2.) Use the render() function to render the Template in the HTML

```html
<html>
    <head></head>
    <body>
        <div id="app"></div>

        <script type="module">
            import {Template,render} from './adarna.js';

            const app   = document.querySelector('#app');
            const t     = new Template();

            let ui = t.div({class:'row'},()=>{

                t.div({class:'col6'},()=>{

                    t.input({type:'text',id:'username'});
                });

                t.div({class:'col6'},()=>{

                    t.input({type:'password',id:'password'});

                });
            });

            render(ui).to(app);

        </script>
    </body>
</html>
```

3.) You can use the compile() method of the Template class to combined all generated elements in one parent document fragment.

```js
    import {Template,render} from './adarna.js';

    const app   = document.querySelector('#app');
    const t     = new Template();

    let data = {1:'yes',0:'no'};

    t.div({class:'row'},()=>{

        t.div({class:'col6'},()=>{
            t.input({type:'text',id:'username'});
        });//div

        t.div({class:'col6'},()=>{
            t.input({type:'password',id:'password'});
        });//div

    });//div

    /******************************************/

    t.div({class:'row'},()=>{

        t.div({class:'col12'},()=>{

            t.select(()=>{

                for(let key in data){

                    let text = data[key];
                    t.option({value:key},text);
                }

            });//div

        });//div

    });//div


    //Combined all DOM elements in one parent document fragment
    let ui = t.compile();

    render(ui).to(app);

```

4.) You can use a JSON object parameter with camelcase notion when using inline style attribute.

```js
    import {Template} from './adarna.js';

    const t = new Template();

    t.div({
        style:{
            backgroundColor:'blue',
            color:'white'
        }
    },'Hello World');
```

Will produce the HTML element

```html
    <div style="background-color:'blue';color:'white'">
        Hello World
    </div>
```


5.) The Template elements can be called in different ways with optional parameters.

```js

    /*
        Type 1 
        
        Parameter 1: Object for attributes
        Parameter 2: Arrow function callback for inner HTML 
    */
    t.div({},(el)=>{

    });

    /*
        Type 2
        
        Parameter 1: Object for attributes
        Parameter 2: String for inner text
    */
     t.div({},'Inner text');

    /*
        Type 3
        
        Parameter 1: Arrow function callback for inner HTML 
    */
    t.div((el)=>{

    });

    /*
        Type 4
        
        Parameter 1: String for inner text 
    */
    t.div('Inner text');
```

6.) Handling events using Template elements are done similar to regular dom elements.

```js

    let button = t.button('I am a button');

    button.onclick = (e)=>{
        alert('Hello World');
    }

    button.addEventListener('click',(e)=>{
        alert('Hello again!');
    });
```

7.) In order to create an independent text node a special method is available called txt().

```js

    t.span(()=>{
        t.txt('Hello World');
    });

```
This will produce the result
```html
    <span>Hello World</span>
```

8.) If needed conditional statements can be used inside the arrow function callback.

```js

    t.div(()=>{

        let test = Math.random() < 0.5;

        if(test){
            t.txt('Hello World');
        }else{
            t.h1('Hakuna Matata');
        }

    });

```
