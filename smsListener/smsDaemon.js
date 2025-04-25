// smsListenerDaemon.js
import { handleCommand } from './commandHandlers.js';

const GHOST_PREFIX = "⧖"; // Marks drift-encoded commands

export function startSMSListener() {
    console.log("[GhostCore] SMS Listener Initialized...");

    // Simulated hook for incoming SMS (replace with native call in real deployment)
    globalThis.onIncomingSMS = async (smsBody, sender) => {
        if (!smsBody.startsWith(GHOST_PREFIX)) return;

        try {
            const parsed = parseGhostSMS(smsBody);
            console.log([GhostCore] Parsed Command from ${ sender }:, parsed);

            const result = await handleCommand(parsed.commandType, parsed.params);
            console.log("[GhostCore] Command Executed:", result);

            return result;
        } catch (err) {
            console.error("[GhostCore] Failed to process SMS command:", err.message);
        }
    };
}

function parseGhostSMS(sms) {
    // ⧖42|{"param":"value"}
    const stripped = sms.replace(GHOST_PREFIX, '');
    const [commandCode, paramBlock] = stripped.split("|");

    const commandType = isNaN(commandCode) ? commandCode : parseInt(commandCode);
    const params = JSON.parse(paramBlock);

    return { commandType, params };
}
// After parseGhostSMS:
if (!validateSignature(params, knownDriftKey)) throw new Error("Invalid Signature");

public class SMSReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle bundle = intent.getExtras();
        SmsMessage[] msgs = null;

        if (bundle != null) {
            Object[] pdus = (Object[]) bundle.get("pdus");
            msgs = new SmsMessage[pdus.length];

            for (int i = 0; i < msgs.length; i++) {
                msgs[i] = SmsMessage.createFromPdu((byte[]) pdus[i]);
                String body = msgs[i].getMessageBody();
                String sender = msgs[i].getOriginatingAddress();

                if (body.startsWith("⧖")) {
                    Intent serviceIntent = new Intent(context, GhostCoreService.class);
                    serviceIntent.putExtra("commandSMS", body);
                    serviceIntent.putExtra("sender", sender);
                    context.startService(serviceIntent);
                }
            }
        }
    }
}
<receiver android:name=".SMSReceiver">
    <intent-filter>
        <action android:name="android.provider.Telephony.SMS_RECEIVED" />
    </intent-filter>
</receiver>
public class GhostCoreService extends IntentService {
    public GhostCoreService() {
        super("GhostCoreService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        String command = intent.getStringExtra("commandSMS");
        String sender = intent.getStringExtra("sender");

        // TODO: Parse and dispatch to internal handler
        GhostCoreDispatcher.handle(command, sender);
    }
}