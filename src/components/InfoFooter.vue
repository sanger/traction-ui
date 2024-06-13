<template>
  <footer :class=footerClasses>
    <div class="max-w-sm mx-auto px-4 sm:px-6">
      <ul class="flex flex-row items-center justify-between my-2 text-xs text-gray-500 space-x-4">
        <li>
          <div class="flex flex-row items-center justify-start gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 inline-block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z"
                clipRule="evenodd"
              />
            </svg>
            <span class="font-bold whitespace-nowrap"> Traction {{ environment }} </span>
          </div>
        </li>
        <li>
          <a
            class="flex flex-row items-center justify-start gap-1"
            href="https://www.sanger.ac.uk/science/groups/production-software-development"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="currentColor"
            >
              <rect fill="none" height="24" width="24" />
              <g>
                <path
                  d="M4,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C2,12.1,2.9,13,4,13z M5.13,14.1C4.76,14.04,4.39,14,4,14 c-0.99,0-1.93,0.21-2.78,0.58C0.48,14.9,0,15.62,0,16.43V18l4.5,0v-1.61C4.5,15.56,4.73,14.78,5.13,14.1z M20,13c1.1,0,2-0.9,2-2 c0-1.1-0.9-2-2-2s-2,0.9-2,2C18,12.1,18.9,13,20,13z M24,16.43c0-0.81-0.48-1.53-1.22-1.85C21.93,14.21,20.99,14,20,14 c-0.39,0-0.76,0.04-1.13,0.1c0.4,0.68,0.63,1.46,0.63,2.29V18l4.5,0V16.43z M16.24,13.65c-1.17-0.52-2.61-0.9-4.24-0.9 c-1.63,0-3.07,0.39-4.24,0.9C6.68,14.13,6,15.21,6,16.39V18h12v-1.61C18,15.21,17.32,14.13,16.24,13.65z M8.07,16 c0.09-0.23,0.13-0.39,0.91-0.69c0.97-0.38,1.99-0.56,3.02-0.56s2.05,0.18,3.02,0.56c0.77,0.3,0.81,0.46,0.91,0.69H8.07z M12,8 c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S11.45,8,12,8 M12,6c-1.66,0-3,1.34-3,3c0,1.66,1.34,3,3,3s3-1.34,3-3 C15,7.34,13.66,6,12,6L12,6z"
                />
              </g>
            </svg>
            Team
          </a>
        </li>
        <li>
          <a class="flex flex-row items-center justify-start gap-1" :href="repo">
            {{ getRelease() }}
          </a>
        </li>
      </ul>
      <div class="mx-auto my-2 text-center text-xs font-medium text-gray-500">
        &copy; {{ new Date().getFullYear() }} Genome Research Ltd.
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'InfoFooter',
  data() {
    return {
      environment: import.meta.env.MODE,
      repo: '',
      linkSlice: 51, //length needed for to slice github URL down to release name
      defaultRelease: 'https://github.com/sanger/traction-ui/releases',
    }
  },
  computed:{
        footerClasses(){
            let bgColorClass = '';
            if (this.environment == 'development'){
                bgColorClass = 'bg-blue-600';
            }else if(this.environment == 'uat'){
                bgColorClass = 'bg-purple-600';
            }else if(this.environment == 'production'){
                bgColorClass = 'bg-gradient-to-tr';
            }
            return [ 'border border-t-2 pt-5 pb-3 flex-shrink-0 border-sdb-100', bgColorClass ];
        }
      },
  created() {
    this.provider()
  },
  methods: {
    getRelease() {
      if (this.repo != this.defaultRelease) {
        return this.repo.slice(this.linkSlice, this.repo.length)
      } else {
        return 'Releases'
      }
    },
    async provider() {
      try {
        await fetch('REPO')
          .then((response) => response.text())
          .then((response1) => {
            // Checks returned text contains REPO text as fetch returns index.html if REPO doesn't exist
            response1.includes('github.com/sanger/traction-ui/releases')
              ? (this.repo = response1)
              : (this.repo = this.defaultRelease)
          })
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>
