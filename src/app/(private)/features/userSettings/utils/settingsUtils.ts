import GearIcon from '@/app/(private)/components/svgs/GearIcon';
import SalesIcon from '@/app/(private)/components/svgs/SalesIcon';
import ExpensesIcon from '@/app/(private)/components/svgs/ExpensesIcon';
import PayrollIcon from '@/app/(private)/components/svgs/PayrollIcon';
import MailIcon from '@/app/(private)/components/svgs/MailIcon';
import VendorSection from '../components/expenses/VendorSection';
import StoreSection from '../components/stores/StoreSelection';
import EmailSection from '../components/emails/EmailSelection';
import AccountSection from '../components/account/AccountSection';
import EmployeeSection from '../components/currentEmployees/EmployeeSelection';

export const sections = [
    {
      id: 'expenses',
      title: 'Expenses',
      icon: ExpensesIcon,
      content: VendorSection
    },
    {
      id: 'payroll',
      title: 'Payroll',
      icon: PayrollIcon,
      content: EmployeeSection
    },
    {
      id: 'sales',
      title: 'Sales',
      icon: SalesIcon,
      content: StoreSection
    },
    {
      id: 'email',
      title: 'Email',
      icon: MailIcon,
      content: EmailSection
    },
    {
      id: 'account',
      title: 'Account',
      icon: GearIcon,
      description: 'Manage your account details, security settings, and user permissions.',
      content: AccountSection
    }
  ];