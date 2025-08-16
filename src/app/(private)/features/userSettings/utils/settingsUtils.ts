import GearIcon from '@/app/(private)/components/svgs/GearIcon';
import SalesIcon from '@/app/(private)/components/svgs/SalesIcon';
import ExpensesIcon from '@/app/(private)/components/svgs/ExpensesIcon';
import PayrollIcon from '@/app/(private)/components/svgs/PayrollIcon';
import MailIcon from '@/app/(private)/components/svgs/MailIcon';
import VendorSection from '../components/expenses/VendorSection';
import StoreSection from '../components/companiesoverview/CompanySelection';
import EmailSection from '../components/emails/EmailSelection';
import AccountSection from '../components/account/AccountSection';
import EmployeeSection from '../components/currentEmployees/EmployeeSelection';

export const sections = [
    // {
    //   id: 'expenses',
    //   title: 'Expenses',
    //   icon: ExpensesIcon,
    //   content: VendorSection
    // },
    // {
    //   id: 'payroll',
    //   title: 'Payroll',
    //   icon: PayrollIcon,
    //   content: EmployeeSection
    // },
    {
      id: 'companies',
      title: 'Companies',
      icon: SalesIcon,
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