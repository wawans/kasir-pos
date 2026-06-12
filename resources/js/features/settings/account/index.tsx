import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Password'
      desc='Update your account password settings.'
    >
      <AccountForm />
    </ContentSection>
  )
}
