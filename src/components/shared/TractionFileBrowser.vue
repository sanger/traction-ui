<template>
    <b-form-file
            id="qcFileInput"
            :ref=refElem
            :state=ready
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            :accept=fileTypes
            size="sm"
            @input=inputAction
          ></b-form-file>
</template>

<script>

export default {
    name: "TractionFileBrowser",
    refElem: {
        type:String,
        required:false,
        default:''
    },
    ready: {
        type:String,
        required:false,
        default:''
    },
    inputAction: {
        type:String,
        required:false,
        default:'' 
    },
    fileTypes: {
        type:String,
        required:false,
        default:'text/csv, .csv'
    }
}
</script>
