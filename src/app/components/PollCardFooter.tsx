import { Avatar, Button, Space } from "antd";
import React from "react";
import { Poll } from "../../types/poll";

interface PollCardFooterProps {
  poll: Poll;
  onVoteButtonClick: () => void;
}

const PollCardFooter: React.FC<PollCardFooterProps> = ({
  poll,
  onVoteButtonClick,
}) => {
  const { total_vote_count, expired, expiry_date } = poll;
  return (
    <>
      <Space style={{ margin: 10 }}>
        <Avatar.Group maxCount={3}>
          {[...Array(total_vote_count)].map((_, index) => (
            <Avatar
              key={index}
              style={{ backgroundColor: "#87d068", cursor: "pointer" }}
            >
              U
            </Avatar>
          ))}
        </Avatar.Group>
        <div style={{ marginLeft: 8, color: "rgba(0, 0, 0, 0.45)" }}>
          Total Votes: {total_vote_count}
        </div>
        {expired ? null : (
          <span style={{ color: " rgba(0, 0, 0, 0.45)" }}>
            {Math.ceil(
              (new Date(expiry_date).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days remaining
          </span>
        )}
        <Button onClick={onVoteButtonClick} disabled={expired}>
          Vote
        </Button>
      </Space>
    </>
  );
};

export default PollCardFooter;
