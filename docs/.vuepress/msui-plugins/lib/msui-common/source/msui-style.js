const getStyleStr = function(url, callback){
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback( xhr.responseText )
        }
    }
    xhr.open('GET', url)
    xhr.send()
};

const createStyleTag = function(){

    let linkTag = document.createElement('style');
    linkTag.setAttribute('id', 'theme');
    document.head.appendChild(linkTag);

    return linkTag;
}

const setTagContent = function(tag, content){
    if(tag instanceof Element)
        tag.innerText = '';
};

const baseUrl = "http://localhost:8089/";
let linkTag = createStyleTag();

getStyleStr(url, cssStr => {
    setTagContent(linkTag, cssStr);
});