import GearIcon from '@/app/(private)/components/svgs/GearIcon';
import MailIcon from '@/app/(private)/components/svgs/MailIcon';
import StoreSection from '../components/companiesoverview/CompanySelection';
import EmailSection from '../components/emails/EmailSelection';
import AccountSection from '../components/account/AccountSection';
import BuildingIcon from '@/app/(private)/components/svgs/BuildingIcon';

export const sections = [
    {
      id: 'companies',
      title: 'Companies',
      icon: BuildingIcon,
      content: StoreSection
    },
    // {
    //   id: 'company',
    //   title: 'Company',
    //   icon: MailIcon,
    //   content: CompanySection
    // },
    // {
    //   id: 'email',
    //   title: 'Email',
    //   icon: MailIcon,
    //   content: EmailSection
    // },
    {
      id: 'account',
      title: 'Account',
      icon: GearIcon,
      description: 'Manage your account details, security settings, and user permissions.',
      content: AccountSection
    }
  ];