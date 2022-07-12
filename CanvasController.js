({
    chart : function(component, event, helper) {
        var action = component.get("c.getAllTasksByStatus");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let val = response.getReturnValue()
                component.set("v.objectList", val)
                console.log('>>>>  '+JSON.stringify(val));
                var labelset=[] ;
                var dataset=[] ;
                val.forEach(function(key) {
                    labelset.push(key.label) ; 
                    dataset.push(key.count) ; 
                });
                new Chart(document.getElementById("chart"), {
                    type: 'pie',
                    data: {
                        labels:labelset,
                        datasets: [{
                            label: "Count of Task",
                            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
                            data: dataset
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Total Tasks by Status'
                        }
                    }
                });
                console.log('Inside3')
            }
        });
        console.log('Inside4')
        $A.enqueueAction(action);
        
    },
    
    downloadPDF :  function(component, event, helper) {
       
        var pages = component.find("chart").getElement(); //document.getElementById('chart');//
        var canvasImage = pages.toDataURL('image/png')
        let image = new Image();
  		image.src = pages.toDataURL();
        console.log('O value  '+pages)
        var a =JSON.parse(JSON.stringify(pages))
        //Create PDF
        console.log(typeof(pages))
        const { jsPDF } = window.jspdf;
       // const doc = new jsPDF('landscape');
        console.log('here	')
        let pdf1 = new jsPDF();
        pdf1.setFontSize(10);
        pdf1.addImage(image,'png',1,1,200,200);
        pdf1.save();
        var temp22 =  btoa(pdf1.output())
        console.log('temp22  ',temp22)
        var filesUploaded = [];
        var action1 = component.get("c.saveFiles");
        filesUploaded.push({
                Title: 'Chart.pdf',
                VersionData: temp22//result.substring(result.indexOf('base64')+7)
            });
        action1.setParams({ filesToInsert : filesUploaded , recordId: '0015j00000fmZ2NAAU'});
        action1.setCallback(this, function(response) {
            console.log('Inside '+JSON.stringify(filesUploaded));
            var state = response.getState();
            if (state === "SUCCESS") {
                let val = response.getReturnValue();
                console.log('Returned Id is '+val);
            }
            else{
                console.log('error is '+state);
            }
        });
        $A.enqueueAction(action1);
        
    
        
    }, 
    
    
    doInit : function(component, event, helper){
        var urlEvent = $A.get("e.force:navigateToURL");
        console.log($A)
        var data= component.get("v.objectList")
        console.log('datat is '+JSON.stringify(data))
        console.log(urlEvent)
        urlEvent.setParams({
            "url":"https://resilient-bear-9rzqc7-dev-ed.lightning.force.com/apex/CanvasExample?data="+data
        });
        urlEvent.fire();
        
    }
})
