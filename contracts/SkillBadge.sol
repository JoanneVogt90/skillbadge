// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillBadge is ERC1155, Ownable {
    struct Badge {
        string name;
        string description;
        string imageURI;
        bool active;
    }

    uint256 private _totalBadgeTypes;

    mapping(uint256 => Badge) private _badges;
    mapping(address => mapping(uint256 => bool)) private _claimed;
    mapping(address => uint256) private _badgeCounts;

    event BadgeClaimed(address indexed user, uint256 indexed badgeId);

    error InvalidBadgeId();
    error InactiveBadge();
    error BadgeAlreadyClaimed();
    error SoulboundBadge();

    constructor() ERC1155("") Ownable(msg.sender) {
        _addBadge(1, "Solidity Builder", "Smart contract development skill badge.", "ipfs://skillbadge/solidity-builder");
        _addBadge(2, "Frontend Developer", "Web3 frontend development skill badge.", "ipfs://skillbadge/frontend-developer");
        _addBadge(3, "Base MiniApp Builder", "Proof of building applications on Base.", "ipfs://skillbadge/base-miniapp-builder");
        _addBadge(4, "Onchain Creator", "Onchain content and creator economy skill badge.", "ipfs://skillbadge/onchain-creator");
        _addBadge(5, "DAO Contributor", "Community governance and DAO contribution badge.", "ipfs://skillbadge/dao-contributor");
        _addBadge(6, "Web3 Researcher", "Crypto research and onchain analysis badge.", "ipfs://skillbadge/web3-researcher");
        _addBadge(7, "NFT Creator", "NFT creation and digital collectible badge.", "ipfs://skillbadge/nft-creator");
        _addBadge(8, "DeFi Explorer", "DeFi protocol interaction and exploration badge.", "ipfs://skillbadge/defi-explorer");
    }

    function claimBadge(uint256 badgeId) external {
        Badge memory badge = _badges[badgeId];

        if (badgeId == 0 || badgeId > _totalBadgeTypes) revert InvalidBadgeId();
        if (!badge.active) revert InactiveBadge();
        if (_claimed[msg.sender][badgeId]) revert BadgeAlreadyClaimed();

        _claimed[msg.sender][badgeId] = true;
        _badgeCounts[msg.sender] += 1;
        _mint(msg.sender, badgeId, 1, "");

        emit BadgeClaimed(msg.sender, badgeId);
    }

    function hasBadge(address user, uint256 badgeId) external view returns (bool) {
        return _claimed[user][badgeId];
    }

    function getBadge(uint256 badgeId) external view returns (Badge memory) {
        if (badgeId == 0 || badgeId > _totalBadgeTypes) revert InvalidBadgeId();
        return _badges[badgeId];
    }

    function badgeCount(address user) external view returns (uint256) {
        return _badgeCounts[user];
    }

    function totalBadgeTypes() external view returns (uint256) {
        return _totalBadgeTypes;
    }

    function setBadgeActive(uint256 badgeId, bool active) external onlyOwner {
        if (badgeId == 0 || badgeId > _totalBadgeTypes) revert InvalidBadgeId();
        _badges[badgeId].active = active;
    }

    function uri(uint256 badgeId) public view override returns (string memory) {
        if (badgeId == 0 || badgeId > _totalBadgeTypes) revert InvalidBadgeId();
        return _badges[badgeId].imageURI;
    }

    function safeTransferFrom(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public pure override {
        revert SoulboundBadge();
    }

    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure override {
        revert SoulboundBadge();
    }

    function _addBadge(uint256 badgeId, string memory name, string memory description, string memory imageURI) private {
        _badges[badgeId] = Badge({
            name: name,
            description: description,
            imageURI: imageURI,
            active: true
        });
        _totalBadgeTypes = badgeId;
    }
}
