/**
 * Ghostery Browser Hub Choose Plan View Component
 *
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2020 Ghostery, Inc. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */

import React, { Fragment } from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import RadioButton from '../../../../panel/components/BuildingBlocks/RadioButton';
import globals from '../../../../../src/classes/Globals';

const BASIC = 0;
const PLUS = 1;
const PREMIUM = 2;

const searchPromo = () => (
	<div className="Step4_ChoosePlanView__searchPromoContainer">
		<div className="Step4_ChoosePlanView__searchLogo" />
		<div className="Step4_ChoosePlanView__adFree">{ t('ghostery_browser_hub_onboarding_ad_free_with_ghostery_plus_subscription') }</div>
		<div className="Step4_ChoosePlanView__adFreePromo">{ t('ghostery_browser_hub_onboarding_ad_free_promo') }</div>
		<div className="Step4_ChoosePlanView__adFreePromoDescription">{ t('ghostery_browser_hub_onboarding_ad_free_promo_description') }</div>
	</div>
);

const basicCard = (checked, handleClick) => {
	const cardClassNames = ClassNames('Step4_ChoosePlanView__card basic', {
		checked
	});
	return (
		<div className="Step4_ChoosePlanView__cardOuter">
			<div className={cardClassNames} onClick={handleClick} data-equalizer-watch>
				<div className="Step4_ChoosePlanView__radioButtonContainer">
					<RadioButton checked={checked} handleClick={handleClick} altDesign />
				</div>
				<div className="card-header-background-free" />
				<div className="ghostery-free-image-container">
					<div className="ghostery-free-image text-center" title="Ghostery Free" alt="Ghostery Free" />
				</div>
				<h2>Ghostery</h2>
				<div className="Step4_ChoosePlanView__price">
					<p className="Step4_ChoosePlanView__price-blue-alt font-size-36">{t('hub_upgrade_plan_free')}</p>
				</div>
				<p className="card-sub-header"><strong>{t('hub_upgrade_basic_protection')}</strong></p>
				<div className="Step4_ChoosePlanView__valuePropList basic">
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_private_search')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_tracker_protection')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_speedy_page_loads')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_intelligence_technology')}
					</div>
				</div>
			</div>
		</div>
	);
};

const plusCard = (checked, handleClick) => {
	const cardClassNames = ClassNames('Step4_ChoosePlanView__card plus', {
		checked
	});
	return (
		<div className="Step4_ChoosePlanView__cardOuter">
			<div className={cardClassNames} onClick={handleClick} data-equalizer-watch>
				<div className="Step4_ChoosePlanView__radioButtonContainer">
					<RadioButton checked={checked} handleClick={handleClick} altDesign />
				</div>
				<div className="ghostery-plus-image-container">
					<div className="ghostery-plus-image" title="Ghostery Plus" alt="Ghostery Plus" />
				</div>
				<h2>Ghostery Plus</h2>
				<div className="Step4_ChoosePlanView__price">
					<Fragment>
						<p className="Step4_ChoosePlanView__price-gold font-size-36">$4.99</p>
						<p className="Step4_ChoosePlanView__price-gold sub-text font-size-12">{t('per_month')}</p>
					</Fragment>
				</div>
				<p className="card-sub-header"><strong>{t('hub_upgrade_additional_protection')}</strong></p>
				<div className="Step4_ChoosePlanView__valuePropList">
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_private_search')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_tracker_protection')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_speedy_page_loads')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_intelligence_technology')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_ad_free')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_supports_ghosterys_mission')}
					</div>
				</div>
			</div>
		</div>
	);
};

const premiumCard = (checked, handleClick) => {
	const cardClassNames = ClassNames('Step4_ChoosePlanView__card premium', {
		checked
	});
	return (
		<div className="Step4_ChoosePlanView__cardOuter">
			<div className={cardClassNames} onClick={handleClick} data-equalizer-watch>
				<div className="Step4_ChoosePlanView__radioButtonContainer">
					<RadioButton checked={checked} handleClick={handleClick} altDesign />
				</div>
				<div className="ghostery-premium-image-container">
					<div className="ghostery-premium-image card-image-top" title="Ghostery Premium" alt="Ghostery Premium" />
				</div>
				<div className="ghostery-premium-image-background" />
				<h2>Ghostery Premium</h2>
				<div className="Step4_ChoosePlanView__price">
					<Fragment>
						<p className="Step4_ChoosePlanView__price-purple sub-text font-size-36">$11.99</p>
						<p className="Step4_ChoosePlanView__price-purple sub-text font-size-12">{t('per_month')}</p>
					</Fragment>
				</div>
				<p className="card-sub-header"><strong>{t('hub_upgrade_maximum_protection')}</strong></p>
				<div className="Step4_ChoosePlanView__valuePropList">
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_private_search')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_tracker_protection')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_speedy_page_loads')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_intelligence_technology')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_ad_free')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_supports_ghosterys_mission')}
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						VPN
					</div>
					<div className="Step4_ChoosePlanView__cardSubCopy">
						<span className="check blue" />
						{t('ghostery_browser_hub_onboarding_unlimited_bandwidth')}
					</div>
				</div>
			</div>
		</div>
	);
};

class Step4_ChoosePlanView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedPlan: -1
		};
		this.plansRef = React.createRef();
		// User object doesn't get populated immediately, let's delay the first render
		setTimeout(this.setDefaultPlan, 200);
	}

	setDefaultPlan = () => {
		const { user } = this.props;
		const isPlus = (user && user.plusAccess) || false;
		const isPremium = (user && user.premiumAccess) || false;

		if (isPremium) {
			this.selectPremiumPlan();
			return;
		}
		if (isPlus) {
			this.selectPlusPlan();
			return;
		}
		this.selectBasicPlan();
	}

	isBasicPlanChecked = () => {
		const { selectedPlan } = this.state;
		return (selectedPlan === BASIC);
	};

	isPlusPlanChecked = () => {
		const { selectedPlan } = this.state;
		return (selectedPlan === PLUS);
	};

	isPremiumPlanChecked = () => {
		const { selectedPlan } = this.state;
		return (selectedPlan === PREMIUM);
	};

	selectBasicPlan = () => this.setState({ selectedPlan: BASIC });

	selectPlusPlan = () => this.setState({ selectedPlan: PLUS });

	selectPremiumPlan = () => this.setState({ selectedPlan: PREMIUM });

	scrollToPlans = () => {
		this.plansRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	renderTitleText = () => {
		const { user } = this.props;
		const isPlus = (user && user.plusAccess) || false;
		const isPremium = (user && user.premiumAccess) || false;

		if (isPremium) return t('ghostery_browser_hub_onboarding_already_premium_subscriber');
		if (isPlus) return t('ghostery_browser_hub_onboarding_already_plus_subscriber');
		return t('ghostery_browser_hub_onboarding_your_privacy_plan');
	};

	renderSubtitleText = (fromSearchSelectionScreen) => {
		const { user } = this.props;
		const isPlus = (user && user.plusAccess) || false;
		const isPremium = (user && user.premiumAccess) || false;

		if (fromSearchSelectionScreen) return t('ghostery_browser_hub_onboarding_based_on_your_privacy_preferences');
		if (isPremium) return '';
		if (isPlus) return t('ghostery_browser_hub_onboarding_keep_your_current_plan_or_upgrade');
		return t('ghostery_browser_hub_onboarding_choose_an_option');
	};

	render() {
		// Case off of if ghostery search was chosen in previous step
		const { user, shouldShowSearchPromo } = this.props;
		const { selectedPlan } = this.state;

		const isPlus = (user && user.plusAccess) || false;
		const isPremium = (user && user.premiumAccess) || false;

		const plusCheckoutLink = `${globals.CHECKOUT_BASE_URL}/plus`;
		const premiumCheckoutLink = `${globals.CHECKOUT_BASE_URL}/premium`;
		return (
			<div>
				<div className="Step4_ChoosePlanView__yourPrivacyPlan">{this.renderTitleText()}</div>
				<div className="Step4_ChoosePlanView__subtitle">{this.renderSubtitleText(shouldShowSearchPromo)}</div>
				{shouldShowSearchPromo && (
					<Fragment>
						{searchPromo()}
						<a className="Step4_ChoosePlanView__searchCTAButton" href={`${globals.CHECKOUT_BASE_URL}/plus`} target="_blank" rel="noreferrer">{t('hub_plan_start_trial')}</a>
						<div className="Step4_ChoosePlanView__seeAllPlans" onClick={this.scrollToPlans}>{t('ghostery_browser_hub_onboarding_see_all_plans')}</div>
						<div className="Step4_ChoosePlanView__arrowDown" onClick={this.scrollToPlans} />
					</Fragment>
				)}
				<div className="Step4_ChoosePlanView__plansContainer" ref={this.plansRef}>
					{!(isPlus || isPremium) && (
						basicCard(this.isBasicPlanChecked(), this.selectBasicPlan)
					)}
					{!isPremium && (
						plusCard(this.isPlusPlanChecked(), this.selectPlusPlan)
					)}
					{premiumCard(this.isPremiumPlanChecked(), this.selectPremiumPlan)}
				</div>
				{(selectedPlan === BASIC || selectedPlan === -1) && (
					// Change to route to next page
					<button className="Step4_ChoosePlanView__searchCTAButton" type="button">{t('ghostery_browser_hub_onboarding_next_or_start_trial')}</button>
				)}
				{selectedPlan === PREMIUM && (
					<a className="Step4_ChoosePlanView__searchCTAButton" href={premiumCheckoutLink} target="_blank" rel="noreferrer">{t('ghostery_browser_hub_onboarding_start_trial')}</a>
				)}
				{selectedPlan === PLUS && (
					<a className="Step4_ChoosePlanView__searchCTAButton" href={plusCheckoutLink} target="_blank" rel="noreferrer">{t('ghostery_browser_hub_onboarding_start_trial')}</a>
				)}
			</div>
		);
	}
}

// PropTypes ensure we pass required props of the correct type
Step4_ChoosePlanView.propTypes = {
	user: PropTypes.shape({
		plusAccess: PropTypes.bool,
		premiumAccess: PropTypes.bool,
	}),
	shouldShowSearchPromo: PropTypes.bool.isRequired,
};

// Default props used in the Plus View
Step4_ChoosePlanView.defaultProps = {
	user: {
		plusAccess: false,
		premiumAccess: false,
	},
};

export default Step4_ChoosePlanView;
