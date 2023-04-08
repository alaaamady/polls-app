import { Modal, Form, Input, Button, notification, Typography } from "antd";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import PollCardChoices from "./PollCardChoices";

interface VoteModalProps {
  pollId: number;
  visible: boolean;
  description: string;
  expired: boolean;
  choices_with_vote_percentage: any[];
  setModalVisible: (arg0: boolean) => void;
  onChoiceSelect: React.Dispatch<React.SetStateAction<null>>;
}

const VoteModal = ({
  pollId,
  visible,
  description,
  expired,
  choices_with_vote_percentage,
  setModalVisible,
  onChoiceSelect,
}: VoteModalProps) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [uuid, setUUID] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleModalSubmit = async () => {
    try {
      const response = await axios.post(`${apiUrl}/vote/`, {
        poll_id: pollId,
        choice_id: selectedChoiceId,
        email,
      });
      setUUID(response.data.uuid);
      notification.success({ message: response.data.message });
    } catch (error) {
      const responseError = error as AxiosError<{ message: string }>;
      if (responseError.response && responseError.response.status === 400) {
        let errorObject: {
          [key: string]: any;
        } = responseError.response.data;
        let errorMessages: any[] = [];

        for (let key in errorObject) {
          if (errorObject.hasOwnProperty(key)) {
            errorMessages = errorMessages.concat(errorObject[key]);
          }
        }

        console.log(errorMessages);
        console.log(responseError.response.data);
        notification.error({ message: errorMessages[0] });
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
      setEmail("");
      setUUID("");
      setModalVisible(false);
    } catch (error) {
      const responseError = error as AxiosError<{ message: string }>;

      if (responseError.response && responseError.response.status === 400) {
        let errorObject: {
          [key: string]: any;
        } = responseError.response.data;
        let errorMessages: any[] = [];

        for (let key in errorObject) {
          if (errorObject.hasOwnProperty(key)) {
            errorMessages = errorMessages.concat(errorObject[key]);
          }
        }
        notification.error({
          message: errorMessages[0],
        });
      } else if (
        responseError.response &&
        responseError.response.status === 404
      ) {
        notification.error({ message: "Poll or choice does not exist" });
      } else {
        notification.error({
          message: "Something went wrong. Please try again later.",
        });
      }
    }
  };
  return (
    <Modal
      title="Vote"
      open={visible}
      onCancel={() => {
        setModalVisible(false);
        setEmail("");
        setUUID("");
        setUUID("");
      }}
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
      <PollCardChoices
        choices_with_vote_percentage={choices_with_vote_percentage}
        expired={expired}
        onChoiceSelect={setSelectedChoiceId}
      />

      <Form style={{ margin: "5%" }}>
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
  );
};

export default VoteModal;
