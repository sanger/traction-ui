import saphyrTubesModule from '@/store/traction/saphyr/tubes'
import saphyrRunsModule from '@/store/traction/saphyr/runs'

const saphyr = {
    namespaced: true,
    modules: {
        tubes: saphyrTubesModule,
        runs: saphyrRunsModule
    }
}

export default saphyr
