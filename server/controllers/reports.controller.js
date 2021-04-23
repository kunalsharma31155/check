require('../models/facility');
require('../models/patient');
require('../models/provider');
require('../models/cptcode');
const mongoose = require('mongoose');
const Facility = mongoose.model('Facility');
const PsychotropicData = mongoose.model('PsychotropicData');
const Patient = mongoose.model('Patient');
const Provider = mongoose.model('Provider');
const CptCode = mongoose.model('CptCode');

const fs = require("fs");
const PDF = require("pdfkit");
var PdfTable = require('voilab-pdf-table');
var pdf = require('html-pdf');
module.exports.psychotropicReport =  async (req,res,next) => {
    let facility;
    let output = [];
    let fromYear = req.body.facilityDateFrom.slice(0,4);
    let fromMonth = req.body.facilityDateFrom.slice(5,7);
    let toYear = req.body.facilityDateTo.slice(0,4);
    let toMonth = req.body.facilityDateTo.slice(5,7);

    if(req.body.facility == "all"){
        facility = await Facility.find({});
        let result = [];
        for(let i=0;i<facility.length;i++){
            result = [];
            let name = facility[i].facilityName;
            if(fromYear == toYear && fromMonth == toMonth && facility[i].psychotropicData.length > 0){  
                for(let j=0;j<facility[i].psychotropicData.length;j++){
                    let recordYear = facility[i].psychotropicData[j].facilityDate.slice(0,4);
                    let recordMonth = facility[i].psychotropicData[j].facilityDate.slice(5,7);
                    if(recordYear == fromYear && recordMonth == fromMonth){
                        result.push(facility[i].psychotropicData[j]);
                    }
                }
                if(result.length>0){
                    result.push(facility[i].facilityName);
                    output.push(result);
                }
            }else if(fromYear <= toYear){
                for(let j=0;j<facility[i].psychotropicData.length;j++){
                    let recordYear = facility[i].psychotropicData[j].facilityDate.slice(0,4);
                    let recordMonth = facility[i].psychotropicData[j].facilityDate.slice(5,7);
                    if(recordYear >= fromYear && recordYear <= toYear){
                        if(fromYear == toYear && recordMonth >= fromMonth && recordMonth <= toMonth){
                            result.push(facility[i].psychotropicData[j]);
                        }else if(fromYear != toYear){
                            if(recordYear == fromYear && recordMonth >= fromMonth){
                                result.push(facility[i].psychotropicData[j]);
                            }else if(recordYear == toYear && recordMonth <= toMonth){
                                result.push(facility[i].psychotropicData[j]);
                            }else if(recordYear != fromYear && recordYear != toYear){
                                result.push(facility[i].psychotropicData[j]);
                            }
                        }
                    }
                }
                if(result.length>0){
                    result.push(facility[i].facilityName);
                    output.push(result);
                }
            }else{
            return res.status(400).json({ type: "Wrong Input", msg: "Check the month and year"});
            }
        }
    }else{
        facility = await Facility.findById({'_id':req.body.facility});

        if(fromYear == toYear && fromMonth == toMonth && facility.psychotropicData.length > 0){
            for(let i=0;i<facility.psychotropicData.length;i++){
                let recordYear = facility.psychotropicData[i].facilityDate.slice(0,4);
                let recordMonth = facility.psychotropicData[i].facilityDate.slice(5,7);
                if(recordYear == fromYear && recordMonth == fromMonth){
                    output.push(facility.psychotropicData[i]);
                }
            }
        }else if(fromYear <= toYear){
        for(let i=0;i<facility.psychotropicData.length;i++){
            let recordYear = facility.psychotropicData[i].facilityDate.slice(0,4);
            let recordMonth = facility.psychotropicData[i].facilityDate.slice(5,7);
            if(recordYear >= fromYear && recordYear <= toYear){
                if(fromYear == toYear && recordMonth >= fromMonth && recordMonth <= toMonth){
                    output.push(facility.psychotropicData[i]);
                }else if(fromYear != toYear){
                    if(recordYear == fromYear && recordMonth >= fromMonth){
                        output.push(facility.psychotropicData[i]);
                    }else if(recordYear == toYear && recordMonth <= toMonth){
                        output.push(facility.psychotropicData[i]);
                    }else if(recordYear != fromYear && recordYear != toYear){
                        output.push(facility.psychotropicData[i]);
                    }
                }
            }
        }
        }else{
            return res.status(400).json({ type: "Wrong Input", msg: "Check the month and year"});
        }
    }
    if(output.length <= 0){
        return res.status(400).json({ type: "Not Found", msg: "Data is Not Available"});
    }else{
    return res.status(200).json({success : true, reportData : output});
    }
}

module.exports.providerPerformanceReport = async (req,res,next) => {
    let from = new Date(req.body.facilityDateFrom);
    let to = new Date(req.body.facilityDateTo);
    let patients;
    let providerPerformance = [];
    let output = [];
    const cpt = await CptCode.find({});
    let providerPerformanceReport = { patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
        Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , FailedGDR : 0 ,
        startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
        Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0};

    let provider = await Provider.find({activeStatus:true}, {"password":0});
    for(let i=0;i<provider.length;i++){
        output.push({"provider":provider[i].firstName,"providerId":provider[i]._id,"facility":[]});
    }
    if(req.body.facility == "all" && req.body.provider == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { dateOfService :{$gte:from,$lte:to}},
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){ 
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false")) {
                    for(let k=0;k<output.length;k++){
                        if(output[k].providerId == patients[i].patientTestData[j].patientProviderId){
                            if(output[k].facility.length <= 0){
                                output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , FailedGDR : 0 ,
                                startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0});
                                output[k].facility[0].patientsEncounters += 1;
                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[0].Identifiednewtrauma += 1; }
                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[0].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[0].Didpsychotherapy += 1; }
                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){
                                    output[k].facility[0].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[0].Assessedcapacity += 1; }
                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[0].NoGDR += 1; }
                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[0].FailedGDR += 1; }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                    output[k].facility[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                     output[k].facility[0].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                     output[k].facility[0].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                     output[k].facility[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                    }
                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[0].Dischargedpt += 1; }
                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[0].Initiatedpriorauth += 1; }
                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[0].Orderedlabs += 1; }
                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[0].Referptto += 1; }
                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[0].points += cpt[t].points;
                                    }
                                }
                                output[k].facility[0].effectiveGDR = output[k].facility[0].stopmeds - output[k].facility[0].startmed; 
                                break;
                            }else{
                                let flag = 0;
                                for(let p=0;p<output[k].facility.length;p++){
                                    if(output[k].facility[p].FacilityId == patients[i].patientTestData[j].patientFacilityId){
                                        output[k].facility[p].patientsEncounters += 1;
                                        if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[p].Identifiednewtrauma += 1; }
                                        if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[p].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                        if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[p].Didpsychotherapy += 1; }
                                        if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){
                                            output[k].facility[p].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                        if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[p].Assessedcapacity += 1; }
                                        if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[p].NoGDR += 1; }
                                        if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[p].FailedGDR += 1; }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                            output[k].facility[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                            output[k].facility[p].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                            output[k].facility[p].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                            output[k].facility[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length }
                                        if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[p].Dischargedpt += 1; }
                                        if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[p].Initiatedpriorauth += 1; }
                                        if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[p].Orderedlabs += 1; }
                                        if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[p].Referptto += 1; }
                                        output[k].facility[p].effectiveGDR = output[k].facility[p].stopmeds - output[k].facility[p].startmed;
                                        for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p].points += cpt[t].points;
                                    }
                                }
                                        flag = 1;    
                                        break;
                                    }
                                    if(flag == 0 && p == (output[k].facility.length-1)){
                                        output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                            FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                            Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , FailedGDR : 0 ,
                                            startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                            Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0});
                                            output[k].facility[p+1].patientsEncounters += 1;
                                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[p+1].Identifiednewtrauma += 1; }
                                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[p+1].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[p+1].Didpsychotherapy += 1; }
                                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){
                                                    output[k].facility[p+1].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[p+1].Assessedcapacity += 1; }
                                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[p+1].NoGDR += 1; }
                                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[p+1].FailedGDR += 1; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                    output[k].facility[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                     output[k].facility[p+1].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                     output[k].facility[p+1].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                     output[k].facility[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[p+1].Dischargedpt += 1; }
                                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[p+1].Initiatedpriorauth += 1; }
                                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[p+1].Orderedlabs += 1; }
                                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[p+1].Referptto += 1; } 
                                                output[k].facility[p+1].effectiveGDR = output[k].facility[p+1].stopmeds - output[k].facility[p+1].startmed;
                                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p+1].points += cpt[t].points;
                                    }
                                }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }else if(req.body.facility == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { patientProviderId : req.body.provider },
                    { dateOfService :{$gte:from,$lte:to}},
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                req.body.provider == patients[i].patientTestData[j].patientProviderId) {
                    // providerPerformance.push(patients[i].patientTestData[j]);
                    for(let k=0;k<output.length;k++){

                        if(output[k].providerId == patients[i].patientTestData[j].patientProviderId){
                            if(output[k].facility.length <= 0){
                                output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , FailedGDR : 0 ,
                                startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0});
                                output[k].facility[0].patientsEncounters += 1;
                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[0].Identifiednewtrauma += 1; }
                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[0].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[0].Didpsychotherapy += 1; }
                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].facility[0].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[0].Assessedcapacity += 1; }
                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[0].NoGDR += 1; }
                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[0].FailedGDR += 1; }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                    output[k].facility[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                     output[k].facility[0].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                     output[k].facility[0].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                     output[k].facility[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                    }
                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[0].Dischargedpt += 1; }
                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[0].Initiatedpriorauth += 1; }
                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[0].Orderedlabs += 1; }
                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[0].Referptto += 1; }
                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[0].points += cpt[t].points;
                                    }
                                }
                                output[k].facility[0].effectiveGDR = output[k].facility[0].stopmeds - output[k].facility[0].startmed;
                                break;
                            }else{
                                let flag = 0;
                                for(let p=0;p<output[k].facility.length;p++){
                                    if(output[k].facility[p].FacilityId == patients[i].patientTestData[j].patientFacilityId){
                                    output[k].facility[p].patientsEncounters += 1;
                                        if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[p].Identifiednewtrauma += 1; }
                                        if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[p].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                        if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[p].Didpsychotherapy += 1; }
                                        if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].facility[p].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                        if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[p].Assessedcapacity += 1; }
                                        if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[p].NoGDR += 1; }
                                        if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[p].FailedGDR += 1; }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                            output[k].facility[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                            }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                             output[k].facility[p].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                            }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                             output[k].facility[p].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                            }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                             output[k].facility[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                            }
                                        if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[p].Dischargedpt += 1; }
                                        if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[p].Initiatedpriorauth += 1; }
                                        if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[p].Orderedlabs += 1; }
                                        if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[p].Referptto += 1; }
                                        for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p].points += cpt[t].points;
                                    }
                                }
                                        output[k].facility[p].effectiveGDR = output[k].facility[p].stopmeds - output[k].facility[p].startmed;
                                        flag = 1;    
                                        break;
                                    }
                                    if(flag == 0 && p == (output[k].facility.length-1)){
                                        output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                            FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                            Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , FailedGDR : 0 ,
                                            startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                            Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0});
                                            output[k].facility[p+1].patientsEncounters += 1;
                                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[p+1].Identifiednewtrauma += 1; }
                                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[p+1].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[p+1].Didpsychotherapy += 1; }
                                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].facility[p+1].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[p+1].Assessedcapacity += 1; }
                                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[p+1].NoGDR += 1; }
                                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[p+1].FailedGDR += 1; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                    output[k].facility[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                     output[k].facility[p+1].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                     output[k].facility[p+1].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                     output[k].facility[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[p+1].Dischargedpt += 1; }
                                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[p+1].Initiatedpriorauth += 1; }
                                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[p+1].Orderedlabs += 1; }
                                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[p+1].Referptto += 1; }
                                                output[k].facility[p+1].effectiveGDR = output[k].facility[p+1].stopmeds - output[k].facility[p+1].startmed;
                                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p+1].points += cpt[t].points;
                                    }
                                }
                                    }
                                }
                                break;
                            }
                        }
                        
                    }
                }
            }
        }
    }else if(req.body.provider == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                        { patientFacilityId : req.body.facility },
                    { dateOfService :{$gte:from,$lte:to}},
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                req.body.facility == patients[i].patientTestData[j].patientFacilityId) {
                    for(let k=0;k<output.length;k++){
                        if(output[k].providerId == patients[i].patientTestData[j].patientProviderId){
                            if(output[k].facility.length <= 0){
                                output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , FailedGDR : 0 ,
                                startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0});
                                output[k].facility[0].patientsEncounters += 1;
                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[0].Identifiednewtrauma += 1; }
                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[0].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[0].Didpsychotherapy += 1; }
                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].facility[0].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[0].Assessedcapacity += 1; }
                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[0].NoGDR += 1; }
                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[0].FailedGDR += 1; }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                    output[k].facility[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                     output[k].facility[0].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                     output[k].facility[0].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                     output[k].facility[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                    }
                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[0].Dischargedpt += 1; }
                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[0].Initiatedpriorauth += 1; }
                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[0].Orderedlabs += 1; }
                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[0].Referptto += 1; }
                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[0].points += cpt[t].points;
                                    }
                                }
                                output[k].facility[0].effectiveGDR = output[k].facility[0].stopmeds - output[k].facility[0].startmed; 
                                break;
                            }else{
                                let flag = 0;
                                for(let p=0;p<output[k].facility.length;p++){
                                    if(output[k].facility[p].FacilityId == patients[i].patientTestData[j].patientFacilityId){
                                    output[k].facility[p].patientsEncounters += 1;
                                        if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[p].Identifiednewtrauma += 1; }
                                        if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[p].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                        if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[p].Didpsychotherapy += 1; }
                                        if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].facility[p].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                        if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[p].Assessedcapacity += 1; }
                                        if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[p].NoGDR += 1; }
                                        if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[p].FailedGDR += 1; }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                            output[k].facility[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                            }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                             output[k].facility[p].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                            }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                             output[k].facility[p].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                            }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                             output[k].facility[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                            }
                                        if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[p].Dischargedpt += 1; }
                                        if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[p].Initiatedpriorauth += 1; }
                                        if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[p].Orderedlabs += 1; }
                                        if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[p].Referptto += 1; }
                                        output[k].facility[p].effectiveGDR = output[k].facility[p].stopmeds - output[k].facility[p].startmed;
                                        for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p].points += cpt[t].points;
                                    }
                                }
                                        flag = 1;    
                                        break;
                                    }
                                    if(flag == 0 && p == (output[k].facility.length-1)){
                                        output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                            FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                            Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , FailedGDR : 0 ,
                                            startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                            Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0});
                                            output[k].facility[p+1].patientsEncounters += 1;
                                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[p+1].Identifiednewtrauma += 1; }
                                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[p+1].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[p+1].Didpsychotherapy += 1; }
                                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].facility[p+1].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[p+1].Assessedcapacity += 1; }
                                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[p+1].NoGDR += 1; }
                                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[p+1].FailedGDR += 1; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                    output[k].facility[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                     output[k].facility[p+1].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                     output[k].facility[p+1].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                     output[k].facility[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[p+1].Dischargedpt += 1; }
                                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[p+1].Initiatedpriorauth += 1; }
                                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[p+1].Orderedlabs += 1; }
                                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[p+1].Referptto += 1; } 
                                                output[k].facility[p+1].effectiveGDR = output[k].facility[p+1].stopmeds - output[k].facility[p+1].startmed;
                                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p+1].points += cpt[t].points;
                                    }
                                }
                                    }
                                }
                                break;
                            }
                        }
                        
                    }
                    // updateRecord(patients[i].patientTestData[j]);
                }
            }
        }
    }else{
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{
                        $and: [
                            { patientFacilityId : req.body.facility },
                            { patientProviderId : req.body.provider },
                            { dateOfService :{$gte:from,$lte:to}},
                        ]
                    }
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") && 
                patients[i].patientTestData[j].patientFacilityId == req.body.facility &&
                patients[i].patientTestData[j].patientProviderId == req.body.provider) {
                    // providerPerformance.push(patients[i].patientTestData[j]);
                    for(let k=0;k<output.length;k++){

                        if(output[k].providerId == patients[i].patientTestData[j].patientProviderId){
                            if(output[k].facility.length <= 0){
                                output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , FailedGDR : 0 ,
                                startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0});
                                output[k].facility[0].patientsEncounters += 1;
                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[0].Identifiednewtrauma += 1; }
                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[0].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[0].Didpsychotherapy += 1; }
                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].facility[0].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[0].Assessedcapacity += 1; }
                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[0].NoGDR += 1; }
                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[0].FailedGDR += 1; }
                                console.log(patients[i].patientTestData[j]);
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                    output[k].facility[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                     output[k].facility[0].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                     output[k].facility[0].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                     output[k].facility[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                    }
                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[0].Dischargedpt += 1; }
                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[0].Initiatedpriorauth += 1; }
                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[0].Orderedlabs += 1; }
                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[0].Referptto += 1; }
                                output[k].facility[0].effectiveGDR = output[k].facility[0].stopmeds - output[k].facility[0].startmed;
                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[0].points += cpt[t].points;
                                    }
                                } 
                                break;
                            }else{
                                let flag = 0;
                                for(let p=0;p<output[k].facility.length;p++){
                                    if(output[k].facility[p].FacilityId == patients[i].patientTestData[j].patientFacilityId){
                                    output[k].facility[p].patientsEncounters += 1;
                                        if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[p].Identifiednewtrauma += 1; }
                                        if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[p].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                        if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[p].Didpsychotherapy += 1; }
                                        if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].facility[p].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                        if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[p].Assessedcapacity += 1; }
                                        if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[p].NoGDR += 1; }
                                        if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[p].FailedGDR += 1; }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                            output[k].facility[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                            }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                             output[k].facility[p].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                            }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                             output[k].facility[p].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                            }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                             output[k].facility[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                            }
                                        if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[p].Dischargedpt += 1; }
                                        if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[p].Initiatedpriorauth += 1; }
                                        if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[p].Orderedlabs += 1; }
                                        if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[p].Referptto += 1; }
                                        output[k].facility[p].effectiveGDR = output[k].facility[p].stopmeds - output[k].facility[p].startmed;
                                        for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p].points += cpt[t].points;
                                    }
                                }
                                        flag = 1;    
                                        break;
                                    }
                                    if(flag == 0 && p == (output[k].facility.length-1)){
                                        output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                            FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                            Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , FailedGDR : 0 ,
                                            startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                            Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0});
                                            output[k].facility[p+1].patientsEncounters += 1;
                                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].facility[p+1].Identifiednewtrauma += 1; }
                                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].facility[p+1].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].facility[p+1].Didpsychotherapy += 1; }
                                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].facility[p+1].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].facility[p+1].Assessedcapacity += 1; }
                                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].facility[p+1].NoGDR += 1; }
                                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].facility[p+1].FailedGDR += 1; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                    output[k].facility[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                     output[k].facility[p+1].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                     output[k].facility[p+1].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                     output[k].facility[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].facility[p+1].Dischargedpt += 1; }
                                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].facility[p+1].Initiatedpriorauth += 1; }
                                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].facility[p+1].Orderedlabs += 1; }
                                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].facility[p+1].Referptto += 1; }
                                                output[k].facility[p+1].effectiveGDR = output[k].facility[p+1].stopmeds - output[k].facility[p+1].startmed;
                                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p+1].points += cpt[t].points;
                                    }
                                } 
                                    }
                                }
                                break;
                            }
                        }
                        
                    }
                    // updateRecord(patients[i].patientTestData[j]);
                }
            }
        }
    }
    let finalOutput = [];
    for(let i=0;i<output.length;i++){
        if(output[i].facility.length >= 1){
            finalOutput.push(output[i]);
        }
    }
    if(finalOutput.length < 1){
        return res.status(400).json({ type: "Not Found", msg: "No data available for the search parameters"});
    }else{
    return res.status(200).json({success : true, report : finalOutput});
    }
}

module.exports.briefProviderPerformanceReport = async (req,res,next) => {
    let from = new Date(req.body.facilityDateFrom);
    let to = new Date(req.body.facilityDateTo);
    let patients;
    let briefproviderPerformance = [];
    let output = [];
    let briefproviderPerformanceReport = { patientsEncounters : 0,points:0,effectiveGDR:0}
    const cpt = await CptCode.find({});
    let provider = await Provider.find({activeStatus:true}, {"password":0});
    for(let i=0;i<provider.length;i++){
        output.push({"provider":provider[i].firstName,"providerId":provider[i]._id,"facility":[]});
    }

    if(req.body.facility == "all" && req.body.provider == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { dateOfService :{$gte:from,$lte:to}},
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false")) {
                    for(let k=0;k<output.length;k++){
                    if(output[k].providerId == patients[i].patientTestData[j].patientProviderId){
                        if(output[k].facility.length <= 0){
                            output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                            FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, effectiveGDR : 0,startmed:0,stopmed:0});
                            output[k].facility[0].patientsEncounters += 1;
                            for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[0].points += cpt[t].points;
                                    }
                                } 
                            if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                output[k].facility[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                }
                            if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                 output[k].facility[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                }
                            output[k].facility[0].effectiveGDR = output[k].facility[0].stopmed - output[k].facility[0].startmed;
                            break;
                        }else{
                            let flag = 0;
                            for(let p=0;p<output[k].facility.length;p++){
                                if(output[k].facility[p].FacilityId == patients[i].patientTestData[j].patientFacilityId){
                                output[k].facility[p].patientsEncounters += 1;
                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p].points += cpt[t].points;
                                    }
                                } 
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                    output[k].facility[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                     output[k].facility[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                    }
                                output[k].facility[p].effectiveGDR = output[k].facility[p].stopmed - output[k].facility[p].startmed;
                                    flag = 1;    
                                    break;
                                }
                                if(flag == 0 && p == (output[k].facility.length-1)){
                                    output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                        FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0,effectiveGDR : 0,startmed:0,stopmed:0});
                                        output[k].facility[p+1].patientsEncounters += 1;
                                        for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p+1].points += cpt[t].points;
                                    }
                                } 
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                            output[k].facility[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                            }
                                        if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                             output[k].facility[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                            }
                                        output[k].facility[p+1].effectiveGDR = output[k].facility[p+1].stopmed - output[k].facility[p+1].startmed;
                                }
                            }
                            break;
                        }
                    }
                }
                    // updateRecord(patients[i].patientTestData[j]);
                }
            }
        }
    }else if(req.body.facility == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { patientProviderId : req.body.provider },
                    { dateOfService :{$gte:from,$lte:to}},
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                req.body.provider == patients[i].patientTestData[j].patientProviderId) {
                    // briefproviderPerformance.push(patients[i].patientTestData[j]);
                    for(let k=0;k<output.length;k++){
                        if(output[k].providerId == patients[i].patientTestData[j].patientProviderId){
                            if(output[k].facility.length <= 0){
                                output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, effectiveGDR : 0,startmed:0,stopmed:0});
                                output[k].facility[0].patientsEncounters += 1;
                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[0].points += cpt[t].points;
                                    }
                                } 
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                    output[k].facility[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                     output[k].facility[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                    }
                                output[k].facility[0].effectiveGDR = output[k].facility[0].stopmed - output[k].facility[0].startmed;
                                break;
                            }else{
                                let flag = 0;
                                for(let p=0;p<output[k].facility.length;p++){
                                    if(output[k].facility[p].FacilityId == patients[i].patientTestData[j].patientFacilityId){
                                    output[k].facility[p].patientsEncounters += 1;
                                    for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p].points += cpt[t].points;
                                    }
                                } 
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                        output[k].facility[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                         output[k].facility[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                        }
                                    output[k].facility[p].effectiveGDR = output[k].facility[p].stopmed - output[k].facility[p].startmed;
                                        flag = 1;    
                                        break;
                                    }
                                    if(flag == 0 && p == (output[k].facility.length-1)){
                                        output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                            FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0,effectiveGDR : 0,startmed:0,stopmed:0});
                                            output[k].facility[p+1].patientsEncounters += 1;
                                            for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p+1].points += cpt[t].points;
                                    }
                                } 
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                output[k].facility[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                 output[k].facility[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                            output[k].facility[p+1].effectiveGDR = output[k].facility[p+1].stopmed - output[k].facility[p+1].startmed;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }else if(req.body.provider == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { patientFacilityId : req.body.facility },
                    { dateOfService :{$gte:from,$lte:to}},
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                req.body.facility == patients[i].patientTestData[j].patientFacilityId) {
                    // briefproviderPerformance.push(patients[i].patientTestData[j]);
                    for(let k=0;k<output.length;k++){
                        if(output[k].providerId == patients[i].patientTestData[j].patientProviderId){
                            if(output[k].facility.length <= 0){
                                output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, effectiveGDR : 0,startmed:0,stopmed:0});
                                output[k].facility[0].patientsEncounters += 1;
                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[0].points += cpt[t].points;
                                    }
                                } 
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                    output[k].facility[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                     output[k].facility[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                    }
                                output[k].facility[0].effectiveGDR = output[k].facility[0].stopmed - output[k].facility[0].startmed;
                                break;
                            }else{
                                let flag = 0;
                                for(let p=0;p<output[k].facility.length;p++){
                                    if(output[k].facility[p].FacilityId == patients[i].patientTestData[j].patientFacilityId){
                                    output[k].facility[p].patientsEncounters += 1;
                                    for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p].points += cpt[t].points;
                                    }
                                } 
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                        output[k].facility[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                         output[k].facility[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                        }
                                    output[k].facility[p].effectiveGDR = output[k].facility[p].stopmed - output[k].facility[p].startmed;
                                        flag = 1;    
                                        break;
                                    }
                                    if(flag == 0 && p == (output[k].facility.length-1)){
                                        output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                            FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0,effectiveGDR : 0,startmed:0,stopmed:0});
                                            output[k].facility[p+1].patientsEncounters += 1;
                                            for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p+1].points += cpt[t].points;
                                    }
                                } 
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                output[k].facility[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                 output[k].facility[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                            output[k].facility[p+1].effectiveGDR = output[k].facility[p+1].stopmed - output[k].facility[p+1].startmed;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    // updateRecord(patients[i].patientTestData[j]);
                }
            }
        }
    }else{
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { patientFacilityId : req.body.facility },
                    { patientProviderId : req.body.provider },
                    { dateOfService :{$gte:from,$lte:to}},
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false")&& 
                patients[i].patientTestData[j].patientFacilityId == req.body.facility &&
                patients[i].patientTestData[j].patientProviderId == req.body.provider) {
                    // briefproviderPerformance.push(patients[i].patientTestData[j]);
                    for(let k=0;k<output.length;k++){
                        if(output[k].providerId == patients[i].patientTestData[j].patientProviderId){
                            if(output[k].facility.length <= 0){
                                output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0, effectiveGDR : 0,startmed:0,stopmed:0});
                                output[k].facility[0].patientsEncounters += 1;
                                for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[0].points += cpt[t].points;
                                    }
                                } 
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                    output[k].facility[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                    }
                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                     output[k].facility[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                    }
                                output[k].facility[0].effectiveGDR = output[k].facility[0].stopmed - output[k].facility[0].startmed;
                                break;
                            }else{
                                let flag = 0;
                                for(let p=0;p<output[k].facility.length;p++){
                                    if(output[k].facility[p].FacilityId == patients[i].patientTestData[j].patientFacilityId){
                                    output[k].facility[p].patientsEncounters += 1;
                                    for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p].points += cpt[t].points;
                                    }
                                } 
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                        output[k].facility[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                         output[k].facility[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                        }
                                    output[k].facility[p].effectiveGDR = output[k].facility[p].stopmed - output[k].facility[p].startmed;
                                        flag = 1;    
                                        break;
                                    }
                                    if(flag == 0 && p == (output[k].facility.length-1)){
                                        output[k].facility.push({facilityName : patients[i].patientTestData[j].patientFacility ,
                                            FacilityId : patients[i].patientTestData[j].patientFacilityId, patientsEncounters : 0, points:0,effectiveGDR : 0,startmed:0,stopmed:0});
                                            output[k].facility[p+1].patientsEncounters += 1;
                                            for(let t=0;t<cpt.length;t++){
                                    if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                        output[k].facility[p+1].points += cpt[t].points;
                                    }
                                } 
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                output[k].facility[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                 output[k].facility[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                            output[k].facility[p+1].effectiveGDR = output[k].facility[p+1].stopmed - output[k].facility[p+1].startmed;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    // updateRecord(patients[i].patientTestData[j]);
                }
            }
        }
    }

    let finalOutput = [];
    for(let i=0;i<output.length;i++){
        if(output[i].facility.length >= 1){
            finalOutput.push(output[i]);
        }
    }
    if(finalOutput.length < 1){
        return res.status(400).json({ type: "Not Found", msg: "No data available for the search parameters"});
    }else{
    return res.status(200).json({success : true, report : finalOutput});
    }
}

module.exports.adminPriorAuthReport = async (req,res,next) => {
    let from = new Date(req.body.facilityDateFrom);
    let to = new Date(req.body.facilityDateTo);
    let patients;
    let adminPriorAuthReport = [];
    if(req.body.facility == "all" && req.body.provider == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { dateOfService :{$gte:from,$lte:to}},
                    { patientPriorAuth : { $exists: true , $ne : ""}}
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                patients[i].patientTestData[j].patientPriorAuth != "") {
                    patients[i].patientTestData[j].parentId = patients[i].firstName;
                    patients[i].patientTestData[j].dateOfService = patients[i].patientDOB;
                    adminPriorAuthReport.push(patients[i].patientTestData[j]);
                }
            }
        }
    }
    else if(req.body.facility == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { patientProviderId : req.body.provider },
                    { dateOfService :{$gte:from,$lte:to}},
                    { patientPriorAuth : { $exists: true , $ne : ""}}
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                req.body.provider == patients[i].patientTestData[j].patientProviderId &&
                patients[i].patientTestData[j].patientPriorAuth != "") {
                    patients[i].patientTestData[j].parentId = patients[i].firstName;
                    patients[i].patientTestData[j].dateOfService = patients[i].patientDOB;
                    adminPriorAuthReport.push(patients[i].patientTestData[j]);
                }
            }
        }
    }else if(req.body.provider == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { patientFacilityId : req.body.facility },
                    { dateOfService :{$gte:from,$lte:to}},
                    { patientPriorAuth : { $exists: true , $ne : ""}}
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                req.body.facility == patients[i].patientTestData[j].patientFacilityId &&
                patients[i].patientTestData[j].patientPriorAuth != "") {
                    patients[i].patientTestData[j].parentId = patients[i].firstName;
                    patients[i].patientTestData[j].dateOfService = patients[i].patientDOB;
                    adminPriorAuthReport.push(patients[i].patientTestData[j]);
                }
            }
        }
    }else{
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { patientFacilityId : req.body.facility },
                    { patientProviderId : req.body.provider },
                    { dateOfService :{$gte:from,$lte:to}},
                    { patientPriorAuth : { $exists: true , $ne : ""}}
                    ]}
                }
            }
        )
        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                patients[i].patientTestData[j].patientFacilityId == req.body.facility &&
                patients[i].patientTestData[j].patientProviderId == req.body.provider &&
                patients[i].patientTestData[j].patientPriorAuth != "") {
                    patients[i].patientTestData[j].parentId = patients[i].firstName;
                    patients[i].patientTestData[j].dateOfService = patients[i].patientDOB;
                    adminPriorAuthReport.push(patients[i].patientTestData[j]);
                }
            }
        }
    }
    if(adminPriorAuthReport.length < 1){
        return res.status(400).json({ type: "Not Found", msg: "No data available for the search parameters"});
    }else{
    return res.status(200).json({success : true, report : adminPriorAuthReport});
    }
}

module.exports.getPatientsForFacilityPatientNumberReport = async (req,res,next) => {
    const PAGE_SIZE = 10;
    const skip = (req.params.page - 1) * PAGE_SIZE;
    let from = new Date(req.body.facilityDateFrom);
    let to = new Date(req.body.facilityDateTo);
    let patients;
    let facilityPatients = [];
    if(req.body.facility != "all"){
        // p = await Patient.find(
        //     {
        //         patientTestData : {
        //             $elemMatch:{ $and: [
        //             { dateOfService :{$gte:from,$lte:to}},
        //             { patientFacilityId : req.body.facility }
        //             ]}
        //         }
        //     }
        // ).countDocuments();
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { dateOfService :{$gte:from,$lte:to}},
                    { patientFacilityId : req.body.facility }
                    ]}
                }
            }
        )
    }else{
        // p = await Patient.find(
        //     {
        //         patientTestData : {
        //             $elemMatch:{ $and: [
        //             { dateOfService :{$gte:from,$lte:to}}
        //             ]},
        //         }
        //     }
        // ).countDocuments(); 
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { dateOfService :{$gte:from,$lte:to}}
                    ]},
                }
            }
        )
    }
    if(patients.length < 1){
        return res.status(400).json({ type: "Not Found", msg: "Patient Not Available For this data."});
    }else{
    return res.status(200).json({success : true, patients : patients});
    }
}

module.exports.getFinalPatientsForFacilityPatientNumberReport = async (req,res,next) => {
    let from = new Date(req.body.input.facilityDateFrom);
    let to = new Date(req.body.input.facilityDateTo);
    let patients;
    let output = [];
    if(req.body.patientId != "all"){
        if(req.body.input.facility != "all"){
            // console.log("report for single facility "+ req.body.input.facility + " and single patient " + req.body.patientId);
            patients = await Patient.find(
                {'_id':req.body.patientId,
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}},
                        {patientFacilityId : req.body.input.facility}
                        ]}
                    }
                }
            )

            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                    patients[i].patientTestData[j].patientFacilityId == req.body.input.facility
                    ) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }else{
            // console.log("report for single patient "+ req.body.patientId +" but all facility");
            patients = await Patient.find(
                {'_id':req.body.patientId,
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}},
                        ]}
                    }
                }
            )
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false")
                    ) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }
    }else{
        if(req.body.input.facility != "all"){
            // console.log("report for single facility"+ req.body.input.facility +"and list of patients"+ req.body.patients.length);
            patients = await Patient.find(
                {
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}},
                        {patientFacilityId : req.body.input.facility}
                        ]}
                    }
                }
            )
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                    patients[i].patientTestData[j].patientFacilityId == req.body.input.facility
                    ) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }else{
            ("report for all facility and list of patients"+ req.body.patients.length);
            patients = await Patient.find(
                {
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}}
                        ]}
                    }
                }
            )
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false")) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }
    }
    return res.status(200).json({success : true, output});
}


module.exports.facilityPerformanceReport = async (req,res,next) => {
    let from = new Date(req.body.facilityDateFrom);
    let to = new Date(req.body.facilityDateTo);
    let patients;
    let facilityPerformance = [];
    let output = [];
    const cpt = await CptCode.find({});
    let facilityPerformanceReport = { patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
        Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0,DidGDR : 0 , FailedGDR : 0 ,
        startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
        Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0, bakerAct: 0,addedSitter: 0,removedSitter:0,depressiveDisorderDx:0,cognitiveImpairmentDx:0};

    let facility = await Facility.find({activeStatus:true}, {"password":0});
    for(let i=0;i<facility.length;i++){
        output.push({"facility":facility[i].facilityName,"facilityId":facility[i]._id,"provider":[]});
    }
    if(req.body.facility == "all" && req.body.provider == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { dateOfService :{$gte:from,$lte:to}},
                    ]}
                }
            }
        )

        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false")) {
                    for(let k=0;k<output.length;k++){
                        if(output[k].facilityId == patients[i].patientTestData[j].patientFacilityId){
                            if(output[k].provider.length <= 0){
                                output[k].provider.push({providerName : patients[i].patientTestData[j].patientProvider ,
                                    ProviderId : patients[i].patientTestData[j].patientProviderId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                    Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 ,DidGDR:0, FailedGDR : 0 ,
                                    startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                    Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0, bakerAct: 0,addedSitter: 0,removedSitter:0,depressiveDisorderDx:0,cognitiveImpairmentDx:0});
                                    output[k].provider[0].patientsEncounters += 1;
                                    if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[0].Identifiednewtrauma += 1; }
                                    if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[0].Didpsychotherapy += 1; }
                                    if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[0].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                    if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[0].depressiveDisorderDx += 1; }
                                    if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[0].cognitiveImpairmentDx += 1; }
                                    if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[0].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                    if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[0].Assessedcapacity += 1; }
                                    if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[0].NoGDR += 1; }
                                    if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[0].DidGDR += 1; }
                                    if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[0].FailedGDR += 1; }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                        output[k].provider[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                         output[k].provider[0].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                         output[k].provider[0].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                         output[k].provider[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                        }
                                    if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[0].Dischargedpt += 1; }
                                    if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[0].Initiatedpriorauth += 1; }
                                    if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[0].Orderedlabs += 1; }
                                    if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[0].Referptto += 1; }
                                    for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[0].points += cpt[t].points;
                                        }
                                    }
                                    output[k].provider[0].effectiveGDR = output[k].provider[0].stopmeds - output[k].provider[0].startmed; 
                                    break;
                            }else{
                                let flag = 0;
                                for(let p=0;p<output[k].provider.length;p++){
                                    if(output[k].provider[p].ProviderId == patients[i].patientTestData[j].patientProviderId){
                                            output[k].provider[p].patientsEncounters += 1;
                                            if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[p].Identifiednewtrauma += 1; }
                                            if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[p].Didpsychotherapy += 1; }
                                            if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[p].depressiveDisorderDx += 1; }
                                            if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[p].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                            if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[p].cognitiveImpairmentDx += 1; }
                                            if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[p].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                            if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[p].Assessedcapacity += 1; }
                                            if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[p].NoGDR += 1; }
                                            if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[p].DidGDR += 1; }
                                            if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[p].FailedGDR += 1; }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                                output[k].provider[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                 output[k].provider[p].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                 output[k].provider[p].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                 output[k].provider[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[p].Dischargedpt += 1; }
                                            if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[p].Initiatedpriorauth += 1; }
                                            if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[p].Orderedlabs += 1; }
                                            if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[p].Referptto += 1; }
                                            for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[p].points += cpt[t].points;
                                        }
                                    }
                                            output[k].provider[p].effectiveGDR = output[k].provider[p].stopmeds - output[k].provider[p].startmed;
                                            flag = 1;    
                                            break;
                                    }
                                    if(flag == 0 && p == (output[k].provider.length-1)){
                                        output[k].provider.push({providerName : patients[i].patientTestData[j].patientProvider ,
                                            ProviderId : patients[i].patientTestData[j].patientProviderId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                            Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , DidGDR : 0, FailedGDR : 0 ,
                                            startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                            Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0, bakerAct: 0,addedSitter: 0,removedSitter:0,depressiveDisorderDx:0,cognitiveImpairmentDx:0});
                                                output[k].provider[p+1].patientsEncounters += 1;
                                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[p+1].Identifiednewtrauma += 1; }
                                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[p+1].Didpsychotherapy += 1; }
                                                if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[p+1].depressiveDisorderDx += 1; }
                                                if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[p+1].cognitiveImpairmentDx += 1; }
                                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[p+1].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[p+1].Assessedcapacity += 1; }
                                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[p+1].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[p+1].NoGDR += 1; }
                                                if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[p+1].DidGDR += 1; }
                                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[p+1].FailedGDR += 1; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                    output[k].provider[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                     output[k].provider[p+1].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                     output[k].provider[p+1].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                     output[k].provider[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[p+1].Dischargedpt += 1; }
                                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[p+1].Initiatedpriorauth += 1; }
                                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[p+1].Orderedlabs += 1; }
                                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[p+1].Referptto += 1; } 
                                                output[k].provider[p+1].effectiveGDR = output[k].provider[p+1].stopmeds - output[k].provider[p+1].startmed;
                                                for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[p+1].points += cpt[t].points;
                                        }
                                    }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

    }else if(req.body.facility == "all"){
                patients = await Patient.find(
                    {
                        patientTestData : {
                            $elemMatch:{ $and: [
                            { patientProviderId : req.body.provider },
                            { dateOfService :{$gte:from,$lte:to}},
                            ]}
                        }
                    }
                )
                
                for(let i=0;i<patients.length;i++){
                    for(let j=0;j<patients[i].patientTestData.length;j++){
                        if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                        Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                        req.body.provider == patients[i].patientTestData[j].patientProviderId) {
                            for(let k=0;k<output.length;k++){
        
                                if(output[k].facilityId == patients[i].patientTestData[j].patientFacilityId){
                                    if(output[k].provider.length <= 0){
                                        output[k].provider.push({providerName : patients[i].patientTestData[j].patientProvider ,
                                            ProviderId : patients[i].patientTestData[j].patientProviderId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                            Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , DidGDR : 0 , FailedGDR : 0 ,
                                            startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                            Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0, bakerAct: 0,addedSitter: 0,removedSitter:0,depressiveDisorderDx:0,cognitiveImpairmentDx:0});
                                            output[k].provider[0].patientsEncounters += 1;
                                            if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[0].Identifiednewtrauma += 1; }
                                            if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[0].Didpsychotherapy += 1; }
                                            if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[0].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                            if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[0].Assessedcapacity += 1; }
                                            if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[0].depressiveDisorderDx += 1; }
                                            if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[0].cognitiveImpairmentDx += 1; }
                                            if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[0].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                            if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[0].NoGDR += 1; }
                                            if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[0].DidGDR += 1; }
                                            if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[0].FailedGDR += 1; }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                                output[k].provider[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                 output[k].provider[0].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                 output[k].provider[0].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                 output[k].provider[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[0].Dischargedpt += 1; }
                                            if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[0].Initiatedpriorauth += 1; }
                                            if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[0].Orderedlabs += 1; }
                                            if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[0].Referptto += 1; }
                                            for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[0].points += cpt[t].points;
                                        }
                                    }
                                            output[k].provider[0].effectiveGDR = output[k].provider[0].stopmeds - output[k].provider[0].startmed; 
                                        break;
                                    }else{
                                        let flag = 0;
                                        for(let p=0;p<output[k].provider.length;p++){
                                            if(output[k].provider[p].ProviderId == patients[i].patientTestData[j].patientProviderId){
                                                
                                            output[k].provider[p].patientsEncounters += 1;
                                            if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[p].Identifiednewtrauma += 1; }
                                            if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[p].Didpsychotherapy += 1; }
                                            if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[p].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                            if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[p].Assessedcapacity += 1; }
                                            if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[p].depressiveDisorderDx += 1; }
                                            if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[p].cognitiveImpairmentDx += 1; }
                                            if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[p].NoGDR += 1; }
                                            if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[p].DidGDR += 1; }
                                            if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[p].FailedGDR += 1; }
                                            if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[p].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                                output[k].provider[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                 output[k].provider[p].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                 output[k].provider[p].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                 output[k].provider[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[p].Dischargedpt += 1; }
                                            if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[p].Initiatedpriorauth += 1; }
                                            if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[p].Orderedlabs += 1; }
                                            if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[p].Referptto += 1; }
                                            for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[p].points += cpt[t].points;
                                        }
                                    }
                                            output[k].provider[p].effectiveGDR = output[k].provider[p].stopmeds - output[k].provider[p].startmed;
                                            flag = 1;    
                                            break;
                                            }
                                            if(flag == 0 && p == (output[k].provider.length-1)){   
                                            output[k].provider.push({providerName : patients[i].patientTestData[j].patientProvider ,
                                            ProviderId : patients[i].patientTestData[j].patientProviderId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                            Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , DidGDR : 0, FailedGDR : 0 ,
                                            startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                            Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0, bakerAct: 0,addedSitter: 0,removedSitter:0,depressiveDisorderDx:0,cognitiveImpairmentDx:0});
                                                output[k].provider[p+1].patientsEncounters += 1;
                                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[p+1].Identifiednewtrauma += 1; }
                                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[p+1].Didpsychotherapy += 1; }
                                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[p+1].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[p+1].Assessedcapacity += 1; }
                                                if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[p+1].depressiveDisorderDx += 1; }
                                                if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[p+1].cognitiveImpairmentDx += 1; }
                                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[p+1].NoGDR += 1; }
                                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[p+1].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                                if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[p+1].DidGDR += 1; }
                                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[p+1].FailedGDR += 1; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                    output[k].provider[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                     output[k].provider[p+1].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                     output[k].provider[p+1].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                     output[k].provider[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[p+1].Dischargedpt += 1; }
                                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[p+1].Initiatedpriorauth += 1; }
                                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[p+1].Orderedlabs += 1; }
                                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[p+1].Referptto += 1; } 
                                                output[k].provider[p+1].effectiveGDR = output[k].provider[p+1].stopmeds - output[k].provider[p+1].startmed;
                                                for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[p+1].points += cpt[t].points;
                                        }
                                    }
                                            }
                                        }
                                        break;
                                    }
                                }
                                
                            }
                        }
                    }
                }
    }else if(req.body.provider == "all"){
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{ $and: [
                    { patientFacilityId : req.body.facility },
                    { dateOfService :{$gte:from,$lte:to}},
                    ]}
                }
            }
        )

        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                req.body.facility == patients[i].patientTestData[j].patientFacilityId) {
                    for(let k=0;k<output.length;k++){
                        if(output[k].facilityId == patients[i].patientTestData[j].patientFacilityId){
                            if(output[k].provider.length <= 0){
                                    output[k].provider.push({providerName : patients[i].patientTestData[j].patientProvider ,
                                    ProviderId : patients[i].patientTestData[j].patientProviderId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                    Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 , DidGDR : 0, FailedGDR : 0 ,
                                    startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                    Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0, bakerAct: 0,addedSitter: 0,removedSitter:0,depressiveDisorderDx:0,cognitiveImpairmentDx:0});
                                    output[k].provider[0].patientsEncounters += 1;
                                    if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[0].Identifiednewtrauma += 1; }
                                    if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[0].Didpsychotherapy += 1; }
                                    if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[0].depressiveDisorderDx += 1; }
                                    if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[0].cognitiveImpairmentDx += 1; }
                                    if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[0].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                    if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[0].Assessedcapacity += 1; }
                                    if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[0].NoGDR += 1; }
                                    if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[0].DidGDR += 1; }
                                    if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[0].FailedGDR += 1; }
                                    if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[0].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                        output[k].provider[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                         output[k].provider[0].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                         output[k].provider[0].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                         output[k].provider[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                        }
                                    if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[0].Dischargedpt += 1; }
                                    if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[0].Initiatedpriorauth += 1; }
                                    if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[0].Orderedlabs += 1; }
                                    if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[0].Referptto += 1; }
                                    output[k].provider[0].effectiveGDR = output[k].provider[0].stopmeds - output[k].provider[0].startmed;
                                    for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[0].points += cpt[t].points;
                                        }
                                    } 
                                    break;
                            }
                            else{
                                let flag = 0;
                                for(let p=0;p<output[k].provider.length;p++){
                                    if(output[k].provider[p].ProviderId == patients[i].patientTestData[j].patientProviderId){
                                        output[k].provider[p].patientsEncounters += 1;
                                            if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[p].Identifiednewtrauma += 1; }
                                            if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[p].Didpsychotherapy += 1; }
                                            if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[p].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                            if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[p].depressiveDisorderDx += 1; }
                                            if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[p].cognitiveImpairmentDx += 1; }
                                            if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[p].Assessedcapacity += 1; }
                                            if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[p].depressiveDisorderDx += 1; }
                                            if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[p].cognitiveImpairmentDx += 1; }
                                            if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[p].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                            if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[p].NoGDR += 1; }
                                            if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[p].DidGDR += 1; }
                                            if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[p].FailedGDR += 1; }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                                output[k].provider[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                 output[k].provider[p].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                 output[k].provider[p].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                 output[k].provider[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[p].Dischargedpt += 1; }
                                            if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[p].Initiatedpriorauth += 1; }
                                            if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[p].Orderedlabs += 1; }
                                            if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[p].Referptto += 1; }
                                            for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[p].points += cpt[t].points;
                                        }
                                    }
                                            output[k].provider[p].effectiveGDR = output[k].provider[p].stopmeds - output[k].provider[p].startmed;
                                            flag = 1;    
                                            break;
                                    }
                                    if(flag == 0 && p == (output[k].provider.length-1)){
                                        output[k].provider.push({providerName : patients[i].patientTestData[j].patientProvider ,
                                            ProviderId : patients[i].patientTestData[j].patientProviderId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                            Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 ,DidGDR:0, FailedGDR : 0 ,
                                            startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                            Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0, bakerAct: 0,addedSitter: 0,removedSitter:0,depressiveDisorderDx:0,cognitiveImpairmentDx:0});
                                                output[k].provider[p+1].patientsEncounters += 1;
                                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[p+1].Identifiednewtrauma += 1; }
                                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[p+1].Didpsychotherapy += 1; }
                                                if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[p+1].depressiveDisorderDx += 1; }
                                                if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[p+1].cognitiveImpairmentDx += 1; }
                                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[p+1].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[p+1].Assessedcapacity += 1; }
                                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[p+1].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[p+1].NoGDR += 1; }
                                                if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[p+1].DidGDR += 1; }
                                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[p+1].FailedGDR += 1; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                    output[k].provider[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                     output[k].provider[p+1].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                     output[k].provider[p+1].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                     output[k].provider[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[p+1].Dischargedpt += 1; }
                                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[p+1].Initiatedpriorauth += 1; }
                                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[p+1].Orderedlabs += 1; }
                                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[p+1].Referptto += 1; } 
                                                output[k].provider[p+1].effectiveGDR = output[k].provider[p+1].stopmeds - output[k].provider[p+1].startmed;
                                                for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[p+1].points += cpt[t].points;
                                        }
                                    }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }else{
        patients = await Patient.find(
            {
                patientTestData : {
                    $elemMatch:{
                        $and: [
                            { patientFacilityId : req.body.facility },
                            { patientProviderId : req.body.provider },
                            { dateOfService :{$gte:from,$lte:to}},
                        ]
                    }
                }
            }
        )

        for(let i=0;i<patients.length;i++){
            for(let j=0;j<patients[i].patientTestData.length;j++){
                if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") && 
                patients[i].patientTestData[j].patientFacilityId == req.body.facility &&
                patients[i].patientTestData[j].patientProviderId == req.body.provider) {
                    for(let k=0;k<output.length;k++){
                        if(output[k].facilityId == patients[i].patientTestData[j].patientFacilityId){
                            if(output[k].provider.length <= 0){
                                output[k].provider.push({providerName : patients[i].patientTestData[j].patientProvider ,
                                    ProviderId : patients[i].patientTestData[j].patientProviderId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                    Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 ,DidGDR:0, FailedGDR : 0 ,
                                    startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                    Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0, bakerAct: 0,addedSitter: 0,removedSitter:0,depressiveDisorderDx:0,cognitiveImpairmentDx:0});
                                    output[k].provider[0].patientsEncounters += 1;
                                    if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[0].Identifiednewtrauma += 1; }
                                    if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[0].Didpsychotherapy += 1; }
                                    if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[0].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                    if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[0].Assessedcapacity += 1; }
                                    if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[0].depressiveDisorderDx += 1; }
                                    if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[0].cognitiveImpairmentDx += 1; }
                                    if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[0].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                    if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[0].NoGDR += 1; }
                                    if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[0].DidGDR += 1; }
                                    if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[0].FailedGDR += 1; }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                        output[k].provider[0].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                         output[k].provider[0].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                         output[k].provider[0].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                        }
                                    if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                         output[k].provider[0].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                        }
                                    if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[0].Dischargedpt += 1; }
                                    if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[0].Initiatedpriorauth += 1; }
                                    if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[0].Orderedlabs += 1; }
                                    if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[0].Referptto += 1; }
                                    for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[0].points += cpt[t].points;
                                        }
                                    }
                                    output[k].provider[0].effectiveGDR = output[k].provider[0].stopmeds - output[k].provider[0].startmed; 
                                    break;
                            }else{
                                let flag = 0;
                                for(let p=0;p<output[k].provider.length;p++){
                                    if(output[k].provider[p].ProviderId == patients[i].patientTestData[j].patientProviderId){
                                        output[k].provider[p].patientsEncounters += 1;
                                            if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[p].Identifiednewtrauma += 1; }
                                            if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[p].Didpsychotherapy += 1; }
                                            if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[p].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                            if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[p].Assessedcapacity += 1; }
                                            if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[p].NoGDR += 1; }
                                            if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[p].DidGDR += 1; }
                                            if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[p].depressiveDisorderDx += 1; }
                                            if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[p].cognitiveImpairmentDx += 1; }
                                            if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[p].FailedGDR += 1; }
                                            if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[p].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){
                                                output[k].provider[p].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length;
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                 output[k].provider[p].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                 output[k].provider[p].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                 output[k].provider[p].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length; 
                                                }
                                            if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[p].Dischargedpt += 1; }
                                            if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[p].Initiatedpriorauth += 1; }
                                            if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[p].Orderedlabs += 1; }
                                            if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[p].Referptto += 1; }
                                            for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[p].points += cpt[t].points;
                                        }
                                    }
                                            output[k].provider[p].effectiveGDR = output[k].provider[p].stopmeds - output[k].provider[p].startmed;
                                            flag = 1;    
                                            break;
                                    }
                                    if(flag == 0 && p == (output[k].provider.length-1)){
                                        output[k].provider.push({providerName : patients[i].patientTestData[j].patientProvider ,
                                            ProviderId : patients[i].patientTestData[j].patientProviderId, patientsEncounters : 0, points:0, Identifiednewtrauma : 0 , Didpsychotherapy : 0 ,
                                            Psychologicaltestperformed : 0 , Dementiatestperformed : 0 , Assessedcapacity : 0 , NoGDR : 0 ,DidGDR:0, FailedGDR : 0 ,
                                            startmed : 0 , increasemed : 0 , decreasemed : 0 , stopmeds : 0 , Dischargedpt : 0 , Initiatedpriorauth  : 0,
                                            Orderedlabs : 0 , Changeddiagnosis : 0 , Referptto : 0 , effectiveGDR : 0, bakerAct: 0,addedSitter: 0,removedSitter:0,depressiveDisorderDx:0,cognitiveImpairmentDx:0});
                                                output[k].provider[p+1].patientsEncounters += 1;
                                                if(patients[i].patientTestData[j].patientNewTrauma != ""){ output[k].provider[p+1].Identifiednewtrauma += 1; }
                                                if(patients[i].patientTestData[j].patientpsychotherapy == "true"){ output[k].provider[p+1].Didpsychotherapy += 1; }
                                                if(patients[i].patientTestData[j].patientDepressiveDisorderDx == "true"){ output[k].provider[p+1].depressiveDisorderDx += 1; }
                                                if(patients[i].patientTestData[j].patientCognitiveImpairmentDx == "true"){ output[k].provider[p+1].cognitiveImpairmentDx += 1; }
                                                if(patients[i].patientTestData[j].patientPsychologicalTesting == "true"){ output[k].provider[p+1].Psychologicaltestperformed += patients[i].patientTestData[j].patientPsychologicalTestingName.length; }
                                                if(patients[i].patientTestData[j].patientAssessedCapacity == "true"){ output[k].provider[p+1].Assessedcapacity += 1; }
                                                if(patients[i].patientTestData[j].performedCognitiveAssessmentTest == "true"){ output[k].provider[p+1].Dementiatestperformed += patients[i].patientTestData[j].performedCognitiveAssessmentTestName.length; }
                                                if(patients[i].patientTestData[j].noGDR == "true"){ output[k].provider[p+1].NoGDR += 1; }
                                                if(patients[i].patientTestData[j].didGDR == "true"){ output[k].provider[p+1].DidGDR += 1; }
                                                if(patients[i].patientTestData[j].failedGDR == "true"){ output[k].provider[p+1].FailedGDR += 1; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "" && patients[i].patientTestData[j].patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != undefined){ 
                                                    output[k].provider[p+1].startmed += patients[i].patientTestData[j].patientSelectedMedChangesStart.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != undefined){
                                                     output[k].provider[p+1].increasemed += patients[i].patientTestData[j].patientSelectedMedChangesIncrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "" && patients[i].patientTestData[j].patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != undefined){
                                                     output[k].provider[p+1].decreasemed += patients[i].patientTestData[j].patientSelectedMedChangesDecrease.length; }
                                                if(patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "" && patients[i].patientTestData[j].patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != undefined){
                                                     output[k].provider[p+1].stopmeds += patients[i].patientTestData[j].patientSelectedMedChangesStop.length;  }
                                                if(patients[i].patientTestData[j].patientDischargedPT == "true"){ output[k].provider[p+1].Dischargedpt += 1; }
                                                if(patients[i].patientTestData[j].patientPriorAuth != ""){ output[k].provider[p+1].Initiatedpriorauth += 1; }
                                                if(patients[i].patientTestData[j].patientOrderedLabs != ""){ output[k].provider[p+1].Orderedlabs += 1; }
                                                if(patients[i].patientTestData[j].patientReferTo != ""){ output[k].provider[p+1].Referptto += 1; } 
                                                output[k].provider[p+1].effectiveGDR = output[k].provider[p+1].stopmeds - output[k].provider[p+1].startmed;
                                                for(let t=0;t<cpt.length;t++){
                                        if(cpt[t].cptCode == patients[i].patientTestData[j].cptCode){
                                            output[k].provider[p+1].points += cpt[t].points;
                                        }
                                    }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    let finalOutput = [];
    for(let i=0;i<output.length;i++){
        if(output[i].provider.length >= 1){
            finalOutput.push(output[i]);
        }
    }
    if(finalOutput.length < 1){
        return res.status(400).json({ type: "Not Found", msg: "No data available for the search parameters"});
    }else{
    return res.status(200).json({success : true, report : finalOutput});
    }

}

module.exports.getFacilityPostRoundingReport = async (req,res,next) => {
    let from = new Date(req.body.facilityDateFrom);
    let to = new Date(req.body.facilityDateTo);
    var postRoundQuery ;
    if(req.body.facility != 'all'){
        postRoundQuery = { "$and": [
            {
                "postRoundData.facilityId": req.body.facility
            },
            {
                "postRoundData.dateOfService": {$gte:from,$lte:to}
            }
        ]};
    }else{
        postRoundQuery = { "$and": [
            {
                "postRoundData.dateOfService": {$gte:from,$lte:to}
            }
        ]};
    }
      let  patients = await Facility.aggregate([
            { "$project":
                {   "facilityName": 1,
                    'facilityName': 1,
                    '_id': 1,
                    'facilityEmail': 1,
                    "partOfCorporate": 1,
                    "postRoundData": 1,
                    "activeStatus": 1
                }
            },
            { "$unwind": {
                "path": "$postRoundData",
                "preserveNullAndEmptyArrays": true
                }
            },
            {"$match": postRoundQuery
        }]);

    return res.status(200).json({success : true, patients});
}

module.exports.getPowerOfAttorneyReport = async (req,res,next) => {
    let from = new Date(req.body.facilityDateFrom);
    let to = new Date(req.body.facilityDateTo);
    var powerOfAttorneyReportQuery ;
    if(req.body.patient != 'all'){
        powerOfAttorneyReportQuery = { "$and": [
            {
                "_id": mongoose.Types.ObjectId(req.body.patient)
            },
            {
                "patientTestData.dateOfService": {$gte:from,$lte:to}
            }
        ]};
    }else{
        powerOfAttorneyReportQuery = { "$and": [
            {
                "patientTestData.dateOfService": {$gte:from,$lte:to}
            }
        ]};
    }
      let  patients = await Patient.aggregate([
            { "$project":
                {   "firstName": 1,
                    'lastName': 1,
                    '_id': 1,
                    'patientDOB': 1,
                    "patientFacility": 1,
                    "patientProvider": 1,
                    "activeStatus": 1,
                    "patientTestData":1
                }
            },
            { "$unwind": {
                "path": "$patientTestData",
                "preserveNullAndEmptyArrays": true
                }
            },
            {"$match": powerOfAttorneyReportQuery
        }]);

    return res.status(200).json({success : true, patients});
}

module.exports.getFinalMissingDocumentReport = async (req,res,next) => {
    let from = new Date(req.body.facilityDateFrom);
    let to = new Date(req.body.facilityDateTo);
    var powerOfAttorneyReportQuery ;
    if(req.body.facility != 'all'){
        powerOfAttorneyReportQuery = { "$and": [
            {
                "patientFacilityId": req.body.facility
            },
            {
                "createdAt": {$gte:from,$lte:to}
            }
        ]};
    }else{
        powerOfAttorneyReportQuery = { "$and": [
            {
                "createdAt": {$gte:from,$lte:to}
            }
        ]};
    }
      let  patients = await Patient.aggregate([
            { "$project":
                {   "firstName": 1,
                    'lastName': 1,
                    '_id': 1,
                    "patientFacilityId":1,
                    "createdAt":1,
                    'patientDOB': 1,
                    "patientFacility": 1,
                    "patientProvider": 1,
                    "activeStatus": 1,
                    "patientTestData":1,
                    "documents":1
                }
            },
            // { "$unwind": {
            //     "path": "$patientTestData",
            //     "preserveNullAndEmptyArrays": true
            //     }
            // },
            {"$match": powerOfAttorneyReportQuery
        }]);

    return res.status(200).json({success : true, patients});
}

module.exports.getFacilityDetailedGDRReport = async (req,res,next) => {
    let from = new Date(req.body.facilityDateFrom);
    let to = new Date(req.body.facilityDateTo);
    var facilityDetailedGDR ;
    reportOutput=[];
    if(req.body.facility != 'all'){
        facilityDetailedGDR = { "$and": [
            {
                "patientTestData.patientFacilityId": req.body.facility
            },
            {
                "patientTestData.dateOfService": {$gte:from,$lte:to}
            }
        ]};
    }else{
        facilityDetailedGDR = { "$and": [
            {
                "patientTestData.dateOfService": {$gte:from,$lte:to}
            }
        ]};
    }
      let  patients = await Patient.aggregate([
            { "$project":
                {   "firstName": 1,
                    'lastName': 1,
                    '_id': 1,
                    'patientDOB': 1,
                    "patientFacility": 1,
                    "patientProvider": 1,
                    "activeStatus": 1,
                    "patientTestData":1
                }
            },
            { "$unwind": {
                "path": "$patientTestData",
                "preserveNullAndEmptyArrays": true
                }
            },
            {"$match": facilityDetailedGDR
        }]);
        for(let i=0;i<patients.length;i++){
            if(reportOutput.some(report => report.facility === patients[i].patientTestData.patientFacility)){
                index = reportOutput.findIndex(x => x.facility === patients[i].patientTestData.patientFacility);
                if(patients[i].patientTestData.noGDR == "true"){ reportOutput[index].noGdr =+ 1; }
                if(patients[i].patientTestData.noGDRComment != null){ 
                    if(patients[i].patientTestData.noGDRComment == "Patient is at Baseline"){
                        reportOutput[index].patientIsAtBaseline += 1; 
                    }else if(patients[i].patientTestData.noGDRComment == "Patient is on no Psych Meds"){
                        reportOutput[index].patientIsOnNoPsychMeds += 1; 
                    }
                 }
                if(patients[i].patientTestData.didGDR == "true"){ reportOutput[index].didGdr =+ 1; }
                if(patients[i].patientTestData.didGDRComment != null){ 
                    if(patients[i].patientTestData.didGDRComment == "Patient is at Baseline"){
                        reportOutput[index].patientIsAtBaselineDidGDR += 1;
                    }else if(patients[i].patientTestData.didGDRComment == "Patient can tolerate GDR"){
                        reportOutput[index].patientCanTolerateGdr += 1; 
                    }else if(patients[i].patientTestData.didGDRComment == "Patient is now Total Care Assist"){
                        reportOutput[index].patientIsNowTotalCareAssist += 1; 
                    }
                 }
                if(patients[i].patientTestData.failedGDR == "true"){ reportOutput[index].failedGdr += 1; }
                if(patients[i].patientTestData.patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != ""){
                    reportOutput[index].DecreaseMed += patients[i].patientTestData.patientSelectedMedChangesDecrease.length;
                }
                if(patients[i].patientTestData.patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != ""){
                    reportOutput[index].stopMed += patients[i].patientTestData.patientSelectedMedChangesStop.length;
                }
            }else{
                reportOutput.push({facility:patients[i].patientTestData.patientFacility,noGdr:0,didGdr:0,failedGdr:0,DecreaseMed:0,stopMed:0,patientIsAtBaseline:0,patientIsOnNoPsychMeds:0,patientCanTolerateGdr:0,patientIsNowTotalCareAssist:0,patientIsAtBaselineDidGDR:0});
                index = reportOutput.findIndex(x => x.facility === patients[i].patientTestData.patientFacility);
                if(patients[i].patientTestData.noGDR == "true"){ reportOutput[index].noGdr =+ 1; }
                if(patients[i].patientTestData.noGDRComment != null){ 
                    if(patients[i].patientTestData.noGDRComment == "Patient is at Baseline"){
                        reportOutput[index].patientIsAtBaseline += 1; 
                    }else if(patients[i].patientTestData.noGDRComment == "Patient is on no Psych Meds"){
                        reportOutput[index].patientIsOnNoPsychMeds += 1; 
                    }
                 }
                if(patients[i].patientTestData.didGDR == "true"){ reportOutput[index].didGdr =+ 1; }
                if(patients[i].patientTestData.didGDRComment != null){ 
                    if(patients[i].patientTestData.didGDRComment == "Patient is at Baseline"){
                        reportOutput[index].patientIsAtBaselineDidGDR += 1; 
                    }else if(patients[i].patientTestData.didGDRComment == "Patient can tolerate GDR"){
                        reportOutput[index].patientCanTolerateGdr += 1; 
                    }else if(patients[i].patientTestData.didGDRComment == "Patient is now Total Care Assist"){
                        reportOutput[index].patientIsNowTotalCareAssist += 1; 
                    }
                 }
                if(patients[i].patientTestData.failedGDR == "true"){ reportOutput[index].failedGdr += 1; }
                if(patients[i].patientTestData.patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != ""){
                    reportOutput[index].DecreaseMed += patients[i].patientTestData.patientSelectedMedChangesDecrease.length;
                }
                if(patients[i].patientTestData.patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != ""){
                    reportOutput[index].stopMed += patients[i].patientTestData.patientSelectedMedChangesStop.length;
                }
            }
        }
        // createInvoice(reportOutput,"facility-detailed-gdr-report.pdf",req.body.facilityDateFrom,req.body.facilityDateTo)
        return res.status(200).json({success : true,report: reportOutput});
}

module.exports.getFinalSnapShotReport = async (req,res,next) => {
    let from = new Date(req.body.input.facilityDateFrom);
    let to = new Date(req.body.input.facilityDateTo);
    let patients;
    let output = [];
    if(req.body.patientId != "all"){
        if(req.body.input.facility != "all"){
            // console.log("report for single facility "+ req.body.input.facility + " and single patient " + req.body.patientId);
            patients = await Patient.find(
                {'_id':req.body.patientId,
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}},
                        {patientFacilityId : req.body.input.facility}
                        ]}
                    }
                }
            )
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                    patients[i].patientTestData[j].patientFacilityId == req.body.input.facility
                    ) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }else{
            // console.log("report for single patient "+ req.body.patientId +" but all facility");
            patients = await Patient.find(
                {'_id':req.body.patientId,
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}},
                        ]}
                    }
                }
            )
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false")
                    ) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }
    }else{
        if(req.body.input.facility != "all"){
            // console.log("report for single facility"+ req.body.input.facility +"and list of patients"+ req.body.patients.length);
            patients = await Patient.find(
                {
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}},
                        {patientFacilityId : req.body.input.facility}
                        ]}
                    }
                }
            )
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                    patients[i].patientTestData[j].patientFacilityId == req.body.input.facility
                    ) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }else{
            // console.log("report for all facility and list of patients"+ req.body.patients.length);
            patients = await Patient.find(
                {
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}}
                        ]}
                    }
                }
            )
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false")) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }
    }
    return res.status(200).json({success : true, output});
}

module.exports.getFinalPatientSummaryReport = async (req,res,next) => {
    // console.log(req.body);
    let from = new Date(req.body.input.facilityDateFrom);
    let to = new Date(req.body.input.facilityDateTo);
    let patients;
    let output = [];
    if(req.body.patientId != "all"){
        if(req.body.input.facility != "all"){
            // console.log("report for single facility "+ req.body.input.facility + " and single patient " + req.body.patientId);
            patients = await Patient.find(
                {'_id':req.body.patientId,
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}},
                        {patientFacilityId : req.body.input.facility}
                        ]}
                    }
                }
            )
            console.log(patients);
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                    patients[i].patientTestData[j].patientFacilityId == req.body.input.facility
                    ) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }else{
            // console.log("report for single patient "+ req.body.patientId +" but all facility");
            patients = await Patient.find(
                {'_id':req.body.patientId,
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}},
                        ]}
                    }
                }
            )
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false")
                    ) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }
    }else{
        if(req.body.input.facility != "all"){
            // console.log("report for single facility"+ req.body.input.facility +"and list of patients"+ req.body.patients.length);
            patients = await Patient.find(
                {
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}},
                        {patientFacilityId : req.body.input.facility}
                        ]}
                    }
                }
            )
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false") &&
                    patients[i].patientTestData[j].patientFacilityId == req.body.input.facility
                    ) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }else{
            // console.log("report for all facility and list of patients"+ req.body.patients.length);
            patients = await Patient.find(
                {
                    patientTestData : {
                        $elemMatch:{ $and: [
                        { dateOfService :{$gte:from,$lte:to}}
                        ]}
                    }
                }
            )
            for(let i=0;i<patients.length;i++){
                for(let j=0;j<patients[i].patientTestData.length;j++){
                    if((Date.parse(patients[i].patientTestData[j].dateOfService) <= Date.parse(to) &&
                    Date.parse(patients[i].patientTestData[j].dateOfService) >= Date.parse(from) && patients[i].patientTestData[j].softDeleted == "false")) {
                        obj = JSON.parse(JSON.stringify(patients[i].patientTestData[j]));
                        obj.firstName = patients[i].firstName;
                        obj.dob = patients[i].patientDOB;
                        output.push(obj);
                    }
                }
            }
        }
    }
    return res.status(200).json({success : true, output});
}



module.exports.printFacilityDetailGDRReport = async (req,res,next) => {
    report = req.body.report;
    path = req.body.reportName;
    from = req.body.from;
    to = req.body.to;
    let table="<p></p>";
    table += "<h1 style='margin-left:5%;'>Facility Detailed GDR Report</h1>";
    table += "<b style='margin-left:5%;'>From - "+from+" To - "+to+"</b>"
    table += "<table style='width:90%; margin-left:5%;word-break:break-word; border-collapse: collapse;font-family: arial, sans-serif;'>";
    table += "<tr style='padding:10px; text-align:center'>";
    table += "<th style='border: 1px solid #dddddd'>Facility</th>";
    table += "<th style='border: 1px solid #dddddd'>Did Gdr</th>";
    table += "<th style='border: 1px solid #dddddd'>Failed Gdr</th>";
    table += "<th style='border: 1px solid #dddddd'>No Gdr</th>";
    table += "<th style='border: 1px solid #dddddd'>Decreased Meds</th>";
    table += "<th style='border: 1px solid #dddddd'>Stop Meds</th>";
    table += "<th style='border: 1px solid #dddddd'>Patient can tolerate GDR</th>";
    table += "<th style='border: 1px solid #dddddd'>Patient is at Baseline</th>";
    table += "<th style='border: 1px solid #dddddd'>Patient is now total care assist</th>";
    table += "<th style='border: 1px solid #dddddd'>Patient is on no psych meds</th>";
    table += "</tr>";

    report.forEach(function(row){
     table += "<tr style='padding:10px; text-align:center'>";
     table += "<td style='border: 1px solid #dddddd'>"+row.facility+"</td>";
        table += "<td style='border: 1px solid #dddddd; background-color:rgba(135, 196, 66, 0.5);'>"+row.didGdr+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.failedGdr+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5); '>"+row.noGdr+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.DecreaseMed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.stopMed+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.patientCanTolerateGdr+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.patientIsAtBaseline+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.patientIsNowTotalCareAssist+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.patientIsOnNoPsychMeds+"</td>";
        table += "</tr>";
    });
    table += "</table>";
    var options = {
        "format": "A4",
        "orientation": "landscape",
        "border": {
          "top": "0.1in",
      },
      "timeout": "120000"
      };
      pdf.create(table, options).toFile(path, function(err, result) {
        if (err) return console.log(err);
        console.log("pdf create");
      });
}

module.exports.printProviderPerformanceReport = async (req,res,next) => {
    report = req.body.report;
    path = req.body.reportName;
    from = req.body.from;
    to = req.body.to;
    let table="<p></p>";
    table += "<h1 style='margin-left:5%;'>Provider Performance Report</h1>";
    table += "<b style='margin-left:5%;'>From - "+from+" To - "+to+"</b>"
    
    report.forEach(function(pro){
        table += "<h3 style='margin-left:5%;'>"+pro.provider+"</h3>"
        table += "<table style='width:90%; margin-left:5%;word-break:break-word; border-collapse: collapse;font-family: arial, sans-serif;'>";
    table += "<tr style='padding:10px; text-align:center; font-weight:100; font-size:10px;'>";
    table += "<th style='border: 1px solid #dddddd'>Facility</th>";
    table += "<th style='border: 1px solid #dddddd'>Patients Encounters</th>";
    table += "<th style='border: 1px solid #dddddd'>Assessed Capacity</th>";
    table += "<th style='border: 1px solid #dddddd'>Changed Diagnosis</th>";
    table += "<th style='border: 1px solid #dddddd'>Dementia Test Performed</th>";
    table += "<th style='border: 1px solid #dddddd'>Did Psychotherapy</th>";
    table += "<th style='border: 1px solid #dddddd'>Discharged Pt</th>";
    table += "<th style='border: 1px solid #dddddd'>Failed GDR</th>";
    table += "<th style='border: 1px solid #dddddd'>Identified New Traum</th>";
    table += "<th style='border: 1px solid #dddddd'>Initiated Prior Auth</th>";
    table += "<th style='border: 1px solid #dddddd'>No GDR</th>";
    table += "<th style='border: 1px solid #dddddd'>Ordered Labs</th>";
    table += "<th style='border: 1px solid #dddddd'>Psychological Test Performed</th>";
    table += "<th style='border: 1px solid #dddddd'>Refer Pt To</th>";
    table += "<th style='border: 1px solid #dddddd'>Decrease Med</th>";
    table += "<th style='border: 1px solid #dddddd'>Effective GDR</th>";
    table += "<th style='border: 1px solid #dddddd'>Increase Med</th>";
    table += "<th style='border: 1px solid #dddddd'>Points</th>";
    table += "<th style='border: 1px solid #dddddd'>Start Med</th>";
    table += "<th style='border: 1px solid #dddddd'>Stop Meds</th>";
    table += "</tr>";

    pro.facility.forEach(function(row){
    table += "<tr style='padding:10px; text-align:center;font-size:10px;'>";
        table += "<td style='border: 1px solid #dddddd'>"+row.facilityName+"</td>";
        table += "<td style='border: 1px solid #dddddd; background-color:rgba(135, 196, 66, 0.5);'>"+row.patientsEncounters+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.Assessedcapacity+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5); '>"+row.Changeddiagnosis+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.Dementiatestperformed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.Didpsychotherapy+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.Dischargedpt+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.FailedGDR+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.Identifiednewtrauma+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.Initiatedpriorauth+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.NoGDR+"</td>";
        table += "<td style='border: 1px solid #dddddd; background-color:rgba(135, 196, 66, 0.5);'>"+row.Orderedlabs+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.Psychologicaltestperformed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5); '>"+row.Referptto+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.decreasemed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.effectiveGDR+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.increasemed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.points+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.startmed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.stopmeds+"</td>";
    table += "</tr>";
    });
    table += "</table>";
    })

    
    var options = {
        "format": "A4",
        "orientation": "landscape",
        "border": {
          "top": "0.1in",
      },
      "timeout": "120000"
      };
      pdf.create(table, options).toFile(path, function(err, result) {
        if (err) return console.log(err);
        console.log("pdf create");
      });
}


module.exports.printBriefProviderPerformanceReport = async (req,res,next) => {
    report = req.body.report;
    path = req.body.reportName;
    from = req.body.from;
    to = req.body.to;
    let table="<p></p>";
    table += "<h1 style='margin-left:5%;'>Brief Provider Performance Report</h1>";
    table += "<b style='margin-left:5%;'>From - "+from+" To - "+to+"</b>"
    
    report.forEach(function(pro){
        table += "<h3 style='margin-left:5%;'>"+pro.provider+"</h3>"
        table += "<table style='width:90%; margin-left:5%;word-break:break-word; border-collapse: collapse;font-family: arial, sans-serif;'>";
    table += "<tr style='padding:10px; text-align:center; font-weight:100; font-size:10px;'>";
    table += "<th style='border: 1px solid #dddddd;text-align:left; margin-left:5px;'>Facility</th>";
    table += "<th style='border: 1px solid #dddddd'>Patients Encounters</th>";
    table += "<th style='border: 1px solid #dddddd'>Points</th>";
    table += "<th style='border: 1px solid #dddddd'>Effective GDR</th>";
    table += "</tr>";

    pro.facility.forEach(function(row){
    table += "<tr style='padding:10px; text-align:center;font-size:10px;'>";
        table += "<td style='border: 1px solid #dddddd; text-align:left; margin-left:5px;'>"+row.facilityName+"</td>";
        table += "<td style='border: 1px solid #dddddd; background-color:rgba(135, 196, 66, 0.5);'>"+row.patientsEncounters+"</td>";
        table += "<td style='border: 1px solid #dddddd; '>"+row.points+"</td>";
        table += "<td style='border: 1px solid #dddddd; background-color:rgba(135, 196, 66, 0.5);;'>"+row.effectiveGDR+"</td>";
    table += "</tr>";
    });
    table += "</table>";
    })

    
    var options = {
        "format": "A4",
        "orientation": "landscape",
        "border": {
          "top": "0.1in",
      },
      "timeout": "120000"
      };
      pdf.create(table, options).toFile(path, function(err, result) {
        if (err) return console.log(err);
        console.log("pdf create");
      });
}

module.exports.printPatientNotesReport = async (req,res,next) => {
    report = req.body.report;
    path = req.body.reportName;
    from = req.body.from;
    to = req.body.to;
    let table="<p></p>";
    table += "<h1 style='margin-left:5%;'>Patient Notes Report</h1>";
    table += "<b style='margin-left:5%;'>From - "+from+" To - "+to+"</b>"
    table += "<table style='width:90%; margin-left:5%;word-break:break-word; border-collapse: collapse;font-family: arial, sans-serif;'>";
    table += "<tr style='padding:10px; text-align:center; font-size:16px; font-weight:400; '>";
    table += "<th style='border: 1px solid #dddddd;  min-width:120px;'>Patient Name</th>";
    table += "<th style='border: 1px solid #dddddd;  min-width:120px;'>Patient DOB</th>";
    table += "<th style='border: 1px solid #dddddd;  min-width:120px;'>Patient Date Of Service</th>";
    table += "<th style='border: 1px solid #dddddd'>Summary</th>";
    table += "</tr>";

    report.forEach(function(row){
     table += "<tr style='padding:10px; text-align:center; font-size:14px;'>";
        table += "<td style='border: 1px solid #dddddd'>"+row.firstName+"</td>";
        table += "<td style='border: 1px solid #dddddd; background-color:rgba(135, 196, 66, 0.5);'>"+row.dob.slice(0,9)+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.dateOfService.slice(0,10)+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5); '>"+row.patientSummary+"</td>";
        table += "</tr>";
    });
    table += "</table>";
    var options = {
        "format": "A4",
        "orientation": "landscape",
        "border": {
          "top": "0.1in",
      },
      "timeout": "120000"
      };
      pdf.create(table, options).toFile(path, function(err, result) {
        if (err) return console.log(err);
        console.log("pdf create");
      });
}

module.exports.printFacilityPracticePerformanceReport = async (req,res,next) => {
    console.log("hnji"+req.body.reportName);
    report = req.body.report;
    path = req.body.reportName;
    from = req.body.from;
    to = req.body.to;
    let table="<p></p>";
    table += "<h1 style='margin-left:5%;'>Facility Performance Report</h1>";
    table += "<b style='margin-left:5%;'>From - "+from+" To - "+to+"</b>"
    
    report.forEach(function(fac){
        table += "<h3 style='margin-left:5%;'>"+fac.facility+"</h3>"
        table += "<table style='width:90%; margin-left:5%;word-break:break-word; border-collapse: collapse;font-family: arial, sans-serif;'>";
    table += "<tr style='padding:10px; text-align:center; font-weight:100; font-size:10px;'>";
    table += "<th style='border: 1px solid #dddddd'>Provider</th>";
    table += "<th style='border: 1px solid #dddddd'>Patients Encounters</th>";
    table += "<th style='border: 1px solid #dddddd'>Assessed Capacity</th>";
    table += "<th style='border: 1px solid #dddddd'>Changed Diagnosis</th>";
    table += "<th style='border: 1px solid #dddddd'>Dementia Test Performed</th>";
    table += "<th style='border: 1px solid #dddddd'>Did Psychotherapy</th>";
    table += "<th style='border: 1px solid #dddddd'>Discharged Pt</th>";
    table += "<th style='border: 1px solid #dddddd'>Failed GDR</th>";
    table += "<th style='border: 1px solid #dddddd'>Identified New Traum</th>";
    table += "<th style='border: 1px solid #dddddd'>Initiated Prior Auth</th>";
    table += "<th style='border: 1px solid #dddddd'>No GDR</th>";
    table += "<th style='border: 1px solid #dddddd'>Ordered Labs</th>";
    table += "<th style='border: 1px solid #dddddd'>Psychological Test Performed</th>";
    table += "<th style='border: 1px solid #dddddd'>Refer Pt To</th>";
    table += "<th style='border: 1px solid #dddddd'>Decrease Med</th>";
    table += "<th style='border: 1px solid #dddddd'>Effective GDR</th>";
    table += "<th style='border: 1px solid #dddddd'>Increase Med</th>";
    table += "<th style='border: 1px solid #dddddd'>Points</th>";
    table += "<th style='border: 1px solid #dddddd'>Start Med</th>";
    table += "<th style='border: 1px solid #dddddd'>Stop Meds</th>";
    table += "</tr>";

    fac.provider.forEach(function(row){
    table += "<tr style='padding:10px; text-align:center;font-size:10px;'>";
        table += "<td style='border: 1px solid #dddddd'>"+row.providerName+"</td>";
        table += "<td style='border: 1px solid #dddddd; background-color:rgba(135, 196, 66, 0.5);'>"+row.patientsEncounters+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.Assessedcapacity+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5); '>"+row.Changeddiagnosis+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.Dementiatestperformed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.Didpsychotherapy+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.Dischargedpt+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.FailedGDR+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.Identifiednewtrauma+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.Initiatedpriorauth+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.NoGDR+"</td>";
        table += "<td style='border: 1px solid #dddddd; background-color:rgba(135, 196, 66, 0.5);'>"+row.Orderedlabs+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.Psychologicaltestperformed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5); '>"+row.Referptto+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.decreasemed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.effectiveGDR+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.increasemed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.points+"</td>";
        table += "<td style='border: 1px solid #dddddd'>"+row.startmed+"</td>";
        table += "<td style='border: 1px solid #dddddd;  background-color:rgba(135, 196, 66, 0.5);'>"+row.stopmeds+"</td>";
    table += "</tr>";
    });
    table += "</table>";
    })

    
    var options = {
        "format": "A4",
        "orientation": "landscape",
        "border": {
          "top": "0.1in",
      },
      "timeout": "120000"
      };
      pdf.create(table, options).toFile(path, function(err, result) {
        if (err) return console.log(err);
        console.log("pdf create");
      });
}
