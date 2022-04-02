export default function(target, options = {}){
    return new Proxy(target, options);
}