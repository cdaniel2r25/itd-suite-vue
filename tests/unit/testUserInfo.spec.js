import { shallowMount } from '@vue/test-utils'
import UserInfoModal from '@/components/navbar/UserInfoModal.vue'
import UserInfo from '@/components/navbar/UserInfo.vue'

describe('UserInfoModal.vue', () => {
  it('renders props.user when passed', () => {
    const msg = {
      firstname: 'Juan',
      lastname: 'Perez',
      email: 'jperez@itdchile.cl',
      cargo: 'Administrador',
      resellers: [
        { name: 'Santander', abbr: 'S' },
        { name: 'BCI', abbr: 'B' },
        { name: 'Banco de Chile', abbr: 'BC' },
        { name: 'Itd Chile', abbr: 'IC' },
      ],
    }
    const wrapper = shallowMount(UserInfoModal, {
      propsData: { user: msg },
    })
    expect(wrapper.props('user')).toEqual(msg)
  })
})

describe('UserInfo.vue', () => {
  it('renders props.user when passed', () => {
    const msg = {
      firstname: 'Juan',
      lastname: 'Perez',
      email: 'jperez@itdchile.cl',
      cargo: 'Administrador',
      resellers: [
        { name: 'Santander', abbr: 'S' },
        { name: 'BCI', abbr: 'B' },
        { name: 'Banco de Chile', abbr: 'BC' },
        { name: 'Itd Chile', abbr: 'IC' },
      ],
    }
    const wrapper = shallowMount(UserInfo, {
      propsData: { user: msg },
    })
    expect(wrapper.props('user')).toEqual(msg)
  })
})
