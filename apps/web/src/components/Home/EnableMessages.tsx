import { EnvelopeIcon, EnvelopeOpenIcon } from '@heroicons/react/24/solid';
import { APP_NAME, XMTP_ENV } from '@hey/data/constants';
import { Button, Card } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Trans } from '@lingui/macro';
import { Client } from '@xmtp/xmtp-js';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useUpdateEffect } from 'usehooks-ts';

const EnableMessages: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { push } = useRouter();
  const [canMessage, setCanMessage] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const onConversationSelected = () => {
    push('/messages');
  };

  useUpdateEffect(() => {
    const fetchCanMessage = async () => {
      const isMessagesEnabled = await Client.canMessage(
        currentProfile?.ownedBy,
        { env: XMTP_ENV }
      );
      setCanMessage(isMessagesEnabled);
      setLoaded(true);
    };
    fetchCanMessage();
  }, [currentProfile]);

  if (!currentProfile || !loaded || canMessage) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="mb-4 space-y-2.5 border-green-400 !bg-green-300/20 p-5 text-green-600"
    >
      <div className="flex items-center space-x-2 font-bold">
        <EnvelopeOpenIcon className="h-5 w-5" />
        <p>
          <Trans>Direct messages are here!</Trans>
        </p>
      </div>
      <p className="mr-10 text-sm leading-[22px]">
        <Trans>
          Activate XMTP to start using {APP_NAME} to send end-to-end encrypted
          DMs to frens.
        </Trans>
      </p>
      <Button
        className={cn({ 'text-sm': true }, 'mr-auto')}
        icon={<EnvelopeIcon className="h-4 w-4" />}
        onClick={onConversationSelected}
      >
        <Trans>Enable DMs</Trans>
      </Button>
    </Card>
  );
};

export default EnableMessages;
