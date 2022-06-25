// SPDX-License-Identifier: None

pragma solidity >=0.8.9;

import {ISuperfluid, ISuperfluidToken, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol"; //"@superfluid-finance/ethereum-monorepo/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import { IInstantDistributionAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";

import {IDAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/IDAv1Library.sol";

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract DeAdSense is Ownable, SuperAppBase {

   using IDAv1Library for IDAv1Library.InitData;

   IDAv1Library.InitData public idaV1;

   uint32 public constant INDEX_ID = 0;

   bytes32 internal constant IDAV1_ID = keccak256(
      "org.superfluid-finance.agreements.InstantDistributionAgreement.v1"
   );

   ISuperToken private cashToken;

   uint public startdate;
   uint public enddate;
   string public link;
   uint public campaignAmount;
   bool public campaignActive;

   constructor(uint _startdate, uint _enddate, string memory _link, ISuperToken _cashToken, uint256 _campaignAmount, ISuperfluid _host) {

      startdate = _startdate;
      enddate = _enddate;
      link = _link;
      cashToken = _cashToken;
      campaignAmount = _campaignAmount;
      campaignActive = true;

      cashToken.transferFrom(msg.sender, address(this), campaignAmount);

      uint256 configWord =
            SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP |
            SuperAppDefinitions.AFTER_AGREEMENT_TERMINATED_NOOP |
            SuperAppDefinitions.AFTER_AGREEMENT_UPDATED_NOOP;

      _host.registerAppWithKey(configWord, "");

      idaV1 = IDAv1Library.InitData(
            _host,
            IInstantDistributionAgreementV1(
                address(_host.getAgreementClass(IDAV1_ID))
            )
        );

      idaV1.createIndex(cashToken, INDEX_ID);
      transferOwnership(msg.sender);
   }

   function distributeFinalFunds() onlyOwner isActive external {
      idaV1.distribute(cashToken, INDEX_ID, campaignAmount);
      campaignActive = false;
   }

   function addFunds(uint256 amount) onlyOwner isActive external {
      cashToken.transferFrom(msg.sender, address(this), amount);
      campaignAmount += amount;
   }

   function impressionRollup(address[] memory refferers, uint128[] memory count) onlyOwner isActive external {
      for (uint256 index = 0; index < refferers.length; index++) {
         ( , , uint256 currentAmount ,) = idaV1.getSubscription(cashToken, address(this), INDEX_ID, refferers[index]);
         idaV1.updateSubscriptionUnits(cashToken, INDEX_ID, refferers[index], uint128(currentAmount) + uint128(count[index]));
      }
   }

   function getReffererUnits(address refferer) external view returns (uint){
      ( , , uint256 currentAmount ,) = idaV1.getSubscription(cashToken, address(this), INDEX_ID, refferer);
      return currentAmount;
   }

   function beforeAgreementCreated(
      ISuperToken superToken,
      address agreementClass,
      bytes32 /* agreementId */,
      bytes calldata /*agreementData*/,
      bytes calldata /*ctx*/
   )
      external view override
      onlyHost
      onlyIDA(agreementClass)
      returns (bytes memory data)
        
   {
      require(superToken == cashToken, "DRT: Unsupported cash token");
      return new bytes(0);
   }

   function _isIDAv1(address agreementClass) private view returns (bool) {
      return ISuperAgreement(agreementClass).agreementType() == IDAV1_ID;
   }

   modifier onlyHost() {
      require(
         msg.sender == address(idaV1.host),
         "Only host can call callback"
      );
      _;
   }

   modifier onlyIDA(address agreementClass) {
      require(_isIDAv1(agreementClass), "Only IDAv1 supported");
      _;
   }

   modifier isActive() {
      require(campaignActive == true, "Campaign is not active");
      _;
   }

}