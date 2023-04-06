import {
  Card,
  Radio,
  Progress,
  Avatar,
  Modal,
  Form,
  Input,
  Button,
  notification,
  Space,
} from "antd";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Typography from "antd/es/typography/Typography";

interface Poll {
  id: number;
  title: string;
  description: string;
  expired: boolean;
  expiry_date: string;
  total_vote_count: number;
  choices_with_vote_percentage: {
    id: number;
    choice_text: string;
    vote_count: number;
    vote_percentage: number;
  }[];
}

interface Props {
  poll: Poll;
}

const PollCard = ({ poll }: Props) => {
  const {
    id,
    title,
    description,
    expired,
    expiry_date,
    total_vote_count,
    choices_with_vote_percentage,
  } = poll;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [uuid, setUUID] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleVoteButtonClick = () => {
    setModalVisible(true);
  };
  const handleModalSubmit = async () => {
    try {
      const response = await axios.post(`${apiUrl}/vote/`, {
        poll_id: id,
        choice_id: selectedChoiceId,
        email,
      });
      setUUID(response.data.uuid);
      notification.success({ message: response.data.message });
    } catch (error) {
      const responseError = error as AxiosError<{ message: string }>;

      if (responseError.response && responseError.response.status === 400) {
        notification.error({ message: "Please enter a valid email." });
      } else {
        notification.error({
          message: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  const handleModalConfirm = async () => {
    try {
      await axios.post(`${apiUrl}/confirm_vote`, {
        otp,
        uuid,
      });
      notification.success({ message: "Thank you for voting!" });
      setModalVisible(false);
    } catch (error) {
      const responseError = error as AxiosError<{ message: string }>;

      if (responseError.response && responseError.response.status === 400) {
        notification.error({ message: "Please enter a valid OTP." });
      } else if (
        responseError.response &&
        responseError.response.status === 404
      ) {
        notification.error({ message: "The OTP entered is incorrect." });
      } else {
        notification.error({
          message: "Something went wrong. Please try again later.",
        });
      }
    }
  };
  const footer = (
    <>
      <Space style={{ margin: 10 }}>
        <Avatar.Group maxCount={3}>
          {[...Array(poll.total_vote_count)].map((_, index) => (
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
        {poll.expired ? null : (
          <span style={{ color: " rgba(0, 0, 0, 0.45)" }}>
            {Math.ceil(
              (new Date(poll.expiry_date).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days remaining
          </span>
        )}
        <Button onClick={handleVoteButtonClick} disabled={poll.expired}>
          Vote
        </Button>
      </Space>
    </>
  );

  return (
    <Card
      title={title}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
      }}
      bordered
      style={{
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      extra={
        expired ? (
          <span style={{ color: "red" }}>Expired</span>
        ) : (
          <span>{`${new Date(expiry_date).getDay()}-${new Date(
            expiry_date
          ).getMonth()}-${new Date(expiry_date).getFullYear()} at ${new Date(
            expiry_date
          ).getUTCHours()}:${new Date(expiry_date).getMinutes()} UTC`}</span>
        )
      }
    >
      <Radio.Group
        disabled={expired}
        onChange={(e) => setSelectedChoiceId(e.target.value)}
      >
        <Space direction="vertical">
          {choices_with_vote_percentage.map((choice) => (
            <Radio key={choice.id} value={choice.id}>
              {choice.choice_text}
              {poll.expired && (
                <Progress
                  percent={choice.vote_percentage}
                  strokeColor="#159895"
                  strokeWidth={10}
                />
              )}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <Modal
        title="Vote"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={!selectedChoiceId || !email}
            onClick={uuid ? handleModalConfirm : handleModalSubmit}
          >
            {uuid ? "Confirm" : "Submit"}
          </Button>,
        ]}
      >
        <Typography>{description}</Typography>
        <Radio.Group
          disabled={expired}
          onChange={(e) => setSelectedChoiceId(e.target.value)}
        >
          <Space direction="vertical">
            {choices_with_vote_percentage.map((choice) => (
              <Radio key={choice.id} value={choice.id}>
                {choice.choice_text}
                {poll.expired && (
                  <Progress
                    percent={choice.vote_percentage}
                    strokeColor="#159895"
                    strokeWidth={10}
                  />
                )}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
        <Form>
          <Form.Item label="Email">
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          {uuid && (
            <Form.Item label="OTP">
              <Input
                about="Please check your email and enter the OTP sent to you to confirm your
            vote."
                placeholder="Enter the OTP received in your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
      {footer}
    </Card>
  );
};

export default PollCard;
