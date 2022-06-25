// SPDX-License-Identifier: None

pragma solidity >=0.8.9;

import {ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol"; //"@superfluid-finance/ethereum-monorepo/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import { IInstantDistributionAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";

import {IDAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/IDAv1Library.sol";

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract DeAdSense is Ownable, SuperAppBase {

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

   mapping (address => bool) public isSubscribing;

   constructor(uint memory _startdate, uint memory _enddate, string memory _link, ISuperToken _cashToken, uint memory _campaignAmount, ISuperFluid _host) {

      startdate = _startdate;
      enddate = _enddate;
      link = _link;
      cashToken = _cashToken;
      campaignAmount = _campaignAmount;

      cashToken.transferFrom(msg.sender, address(this), campaignAmount);

      uint256 configWord =
            SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP |
            SuperAppDefinitions.AFTER_AGREEMENT_TERMINATED_NOOP;

      _host.registerApp(configWord);

      idaV1 = IDAv1Library.InitData(
            _host,
            IInstantDistributionAgreementV1(
                address(_host.getAgreementClass(IDAV1_ID))
            )
        );

      idaV1.createIndex(_cashToken, INDEX_ID);
      transferOwnership(msg.sender);
   }

   function distributeFinalFunds() onlyOwner {
      //TO-DO
   }

   function addFunds() onlyOwner {
      //TO-DO
   }

   function impressionRollup() onlyOwner {
      //TO-DO
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
      require(superToken == _cashToken, "DRT: Unsupported cash token");
      return new bytes(0);
   }

   function afterAgreementUpdated(
      ISuperToken superToken,
      address agreementClass,
      bytes32 agreementId,
      bytes calldata /*agreementData*/,
      bytes calldata /*cbdata*/,
      bytes calldata ctx
   )
      external override
      onlyHost
      onlyIDA(agreementClass)
      returns(bytes memory newCtx)
   {
      _checkSubscription(superToken, ctx, agreementId);
      newCtx = ctx;
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

}