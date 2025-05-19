import { mount } from '@support/testHelper'
import LabwhereReception from '@/views/LabwhereReception.vue'
import {
  scanBarcodesInLabwhereLocation,
  scanBarcodesInLabwhereLocationV2,
} from '@/services/labwhere/client.js'
import * as labwhereClient from '@/services/labwhere/client.js'
import { beforeEach } from 'vitest'

vi.mock('@/services/labwhere/client.js')

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

const mockCheckFeatureFlag = vi.fn(() => false)
vi.mock('@/api/FeatureFlag', () => ({
  default: () => ({
    checkFeatureFlag: mockCheckFeatureFlag,
  }),
}))

describe('LabWhereReception', () => {
  let mockExhaustSamples
  const buildWrapper = () => {
    return mount(LabwhereReception)
  }

  beforeEach(() => {
    mockExhaustSamples = vi.spyOn(labwhereClient, 'exhaustLibraryVolumeIfDestroyed')
    mockExhaustSamples.mockResolvedValue({ success: false })
  })

  it('has a user code input field', () => {
    const wrapper = buildWrapper()
    const userCodeInput = wrapper.find('#userCode')
    expect(userCodeInput.exists()).toBe(true)
    expect(userCodeInput.attributes('type')).toBe('password')
  })

  it('has a location barcode input field', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('#locationBarcode').exists()).toBe(true)
  })

  it('has a start position input field', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('#startPosition').exists()).toBe(true)
  })

  it('has a labware barcodes textarea', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('#labware_barcodes').exists()).toBe(true)
  })

  it('shows error messages for empty required fields on submit', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('#submit-button').trigger('submit')

    expect(wrapper.find('[data-attribute="user-code-error"]').text()).toBe('User code is required')
    expect(wrapper.find('[data-attribute="barcodes-error"]').text()).toBe(
      'Labware barcodes are required',
    )
  })

  it('only scans unique barcodes when duplicate barcodes are given', async () => {
    const wrapper = buildWrapper()
    wrapper.vm.user_code = 'user1'
    wrapper.vm.location_barcode = 'location1'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode1'
    scanBarcodesInLabwhereLocation.mockResolvedValue({
      success: true,
      message: 'barcode1 successfully stored in location123',
    })
    await wrapper.find('#submit-button').trigger('submit')
    expect(scanBarcodesInLabwhereLocation).toBeCalledWith('user1', 'location1', 'barcode1', null)
  })

  it('validates when user types in fields', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('#submit-button').trigger('submit')
    expect(wrapper.vm.errors).toEqual({
      user_code: 'User code is required',
      labware_barcodes: 'Labware barcodes are required',
    })

    const barcodeInput = wrapper.find('#labware_barcodes')
    await barcodeInput.setValue('barcode1')

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.errors).toEqual({
      user_code: 'User code is required',
    })

    wrapper.find('[data-attribute="user-code-input"]').setValue('user1')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.errors).not.toHaveProperty('user_code')
  })

  it('chooses the correct scan function based on the feature flag', async () => {
    const wrapper = buildWrapper()
    wrapper.vm.user_code = 'user123'
    wrapper.vm.location_barcode = 'location123'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'
    wrapper.vm.start_position = 1

    mockCheckFeatureFlag.mockResolvedValue(true)

    scanBarcodesInLabwhereLocationV2.mockResolvedValue({
      success: true,
      message: 'barcode1, barcode2 successfully stored in location123',
    })

    await wrapper.find('#submit-button').trigger('submit')

    // expect(mockCheckFeatureFlag).toHaveBeenCalledWith('rust_labwhere_service')

    expect(scanBarcodesInLabwhereLocationV2).toHaveBeenCalledWith(
      'user123',
      'location123',
      'barcode1\nbarcode2',
      1,
    )

    expect(mockShowAlert).toBeCalledWith(
      'barcode1, barcode2 successfully stored in location123',
      'success',
    )
  })

  it('validates and submits the form successfully', async () => {
    const wrapper = buildWrapper()
    wrapper.vm.user_code = 'user123'
    wrapper.vm.location_barcode = 'location123'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'
    scanBarcodesInLabwhereLocation.mockResolvedValue({
      success: true,
      message: 'barcode1, barcode2 successfully stored in location123',
    })

    await wrapper.find('#submit-button').trigger('submit')
    expect(scanBarcodesInLabwhereLocation).toHaveBeenCalledWith(
      'user123',
      'location123',
      'barcode1\nbarcode2',
      null,
    )
    expect(mockShowAlert).toBeCalledWith(
      'barcode1, barcode2 successfully stored in location123',
      'success',
    )
    expect(mockExhaustSamples).toBeCalledWith('location123', ['barcode1', 'barcode2'])
  })

  it('validates form and exhaust libraries successfully', async () => {
    const wrapper = buildWrapper()
    wrapper.vm.user_code = 'user123'
    wrapper.vm.location_barcode = 'location123'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'
    scanBarcodesInLabwhereLocation.mockResolvedValue({
      success: true,
      message: 'barcode1, barcode2 successfully stored in location123',
    })
    mockExhaustSamples.mockResolvedValue({
      success: true,
      exhaustedLibraries: [{ barcode: 'barcode1' }],
    })

    await wrapper.find('#submit-button').trigger('submit')
    expect(scanBarcodesInLabwhereLocation).toHaveBeenCalledWith(
      'user123',
      'location123',
      'barcode1\nbarcode2',
      null,
    )
    expect(mockShowAlert).toBeCalledWith(
      'barcode1, barcode2 successfully stored in location123 and sample volumes have been exhausted for 1 library',
      'success',
    )
  })

  it('displays preview message when user enters values in the form', async () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('[data-attribute="preview-message"]').text()).toBe(
      'No barcodes to scan to location',
    )

    wrapper.vm.location_barcode = 'location123'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-attribute="preview-message"]').text()).toBe(
      'No barcodes to scan to location location123',
    )

    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-attribute="preview-message"]').text()).toBe(
      'Scan in 2 barcode(s) to location location123',
    )

    wrapper.vm.location_barcode = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-attribute="preview-message"]').text()).toBe(
      'Scan out 2 barcode(s) from their current locations',
    )
  })

  it('shows an error alert if the form submission fails', async () => {
    const wrapper = buildWrapper()

    wrapper.vm.user_code = 'user123'
    wrapper.vm.location_barcode = 'location123'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'

    scanBarcodesInLabwhereLocation.mockResolvedValue({
      success: false,
      errors: ['Error storing barcodes'],
    })

    await wrapper.find('#submit-button').trigger('submit')

    expect(mockShowAlert).toBeCalledWith('Error storing barcodes', 'danger')
  })

  it('resets the fields when reset button is clicked', async () => {
    const wrapper = buildWrapper()
    wrapper.vm.user_code = 'user123'
    wrapper.vm.location_barcode = 'location123'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'
    wrapper.vm.start_position = 1

    await wrapper.find('#reset-button').trigger('reset')

    // We don't reset user code as its likely to be the same user
    expect(wrapper.vm.user_code).toBe('user123')
    expect(wrapper.vm.location_barcode).toBe('')
    expect(wrapper.vm.labware_barcodes).toBe('')
    expect(wrapper.vm.start_position).toBe(null)
  })
})
