const IJS=require('image-js');

let filename='600-000.png';

process();

async function process() {

    let image=await IJS.Image.load(__dirname+'/../data/'+filename);

    let red = image.grey({algorithm: 'red'});
    let green = image.grey({algorithm: 'green'});
    let redMask = red.mask({threshold: 80});
    var redMbr = redMask.minimalBoundingRectangle();
    
    let greenMask = green.mask({threshold: 60}).invert();
    var greenMbr = greenMask.minimalBoundingRectangle();
    
    let histograms=image.getHistograms()
 
    var black = IJS.Image.createFrom(image);
    var roiManager = black.getRoiManager();
    
    
    roiManager.fromMask(redMask);
    var redRois = roiManager.getRois({negative:false});
    roiManager.paint({negative:false, color: 'red'});
    
    roiManager.fromMask(greenMask);
    var greenRois=roiManager.getRois({negative:false});
    var painted=roiManager.paint({negative:false, color: 'green'});
    
    
    painted.paintPolygon(redMbr, {color:[0,255,255]});
    painted.paintPoints( [ [
        Math.round(redMbr.reduce( (previous, current) => previous+=current[0], 0)/redMbr.length),
        Math.round(redMbr.reduce( (previous, current) => previous+=current[1], 0)/redMbr.length)
    ] ], {color:[0,255,255]});
    
    painted.paintPolygon(greenMbr, {color:[255,0,255]});
    painted.paintPoints( [ [
        Math.round(greenMbr.reduce( (previous, current) => previous+=current[0], 0)/redMbr.length),
        Math.round(greenMbr.reduce( (previous, current) => previous+=current[1], 0)/redMbr.length)
    ] ], {color:[255,0,255]});
    
  
    painted.save(__dirname+'/../output/'+filename);
    
}

