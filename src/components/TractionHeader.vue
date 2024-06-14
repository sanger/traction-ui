<template>
    <div :class="headerClasses">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div class="flex flex-row gap-x-2">
            <img class="w-8 h-8" src="../images/traction-logo.svg" alt="Traction logo" />
            <div class="text-white text-2xl">Traction</div>
            <TractionLink name="Home" link="/dashboard" view-type="2" />
            <TractionLink name="Label Printing" link="/label-printing" view-type="2" />
            <TractionLink name="QC Results Upload" link="/qc-results-upload" view-type="2" />
            <TractionLink name="Reception" link="/reception" view-type="2" />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import TractionLink from '@/components/TractionLink'
    
    export default {
      components: {
         TractionLink
      },
      name: 'TractionHeader',
      data(){
        return {
           environment: process.env.NODE_ENV,
        };
      },
      computed:{
        headerClasses(){
            let bgColorClass = '';
            if (this.environment == 'development'){
                bgColorClass = 'bg-blue-600';
            }else if(this.environment == 'staging'){
                bgColorClass = 'bg-purple-600';
            }else if(this.environment == 'production'){
                bgColorClass = 'bg-gradient-to-tr';
            }
            return [ 'relative from-sdb to-sdb-400', bgColorClass ];
        },
      },
    }

</script>