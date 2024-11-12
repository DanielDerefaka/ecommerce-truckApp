import FinancingBenefits from '@/components/global/financial/FinancialBenefit'
import FinancingCalculator from '@/components/global/financial/FinancialCalculator'
import FinancialSec2 from '@/components/global/financial/FinancialSec2'
// import FinancingCalculator from '@/components/global/financial/FinancialCalculator'
import FinancingHero from '@/components/global/financial/ServicesSection'
import FinanceTop from '@/components/global/site/FinanceTop1'
import React from 'react'

const page = () => {
  return (
    <div>
        <FinanceTop/>
        <FinancingBenefits/>
        <FinancingCalculator/>
        <FinancingHero/>
      <FinancialSec2/>
       
       
    </div>
  )
}

export default page