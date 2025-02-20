import { AlertDialog, AlertDialogBackdrop, AlertDialogContent } from "@/components/ui/alert-dialog";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HStack } from "./ui/hstack";

interface LogoutAlertProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

export function LogoutAlert({ isOpen, onClose, onLogout }: LogoutAlertProps) {
    return (
        <AlertDialog 
            isOpen={isOpen} 
            onClose={onClose}
        >
            <AlertDialogBackdrop className="bg-black" />
            <AlertDialogContent className="mx-4 rounded-lg bg-background-light dark:bg-background-dark backdrop-blur-xl">
                <VStack space="xl">
                    <VStack space="sm" className="items-center">
                        <Heading
                            size="lg"
                            className="font-bold tracking-wide text-center text-typography-900 dark:text-typography"
                        >
                            Keluar Aplikasi
                        </Heading>
                        <VStack space="xs" className="items-center">
                            <Text
                                className="text-center text-typography-500/90 dark:text-typography-400/90"
                            >
                                Apakah Anda yakin ingin keluar?
                            </Text>
                            <Text
                                className="text-center text-xs text-error-500"
                            >
                                Peringatan: Akun Anda akan terkunci sementara setelah keluar untuk alasan keamanan.
                            </Text>
                        </VStack>
                    </VStack>

                    <HStack space="md" className="w-full mt-2">
                        <Button
                            variant="outline"
                            onPress={onClose}
                            className="flex-1 rounded-lg border-typography-100 dark:border-typography-800"
                            size="lg"
                        >
                            <ButtonText className="font-medium">Batal</ButtonText>
                        </Button>
                        <Button
                            variant="solid"
                            action="primary"
                            onPress={onLogout}
                            className="flex-1 rounded-lg shadow-sm"
                            size="lg"
                        >
                            <ButtonText className="font-medium">Keluar</ButtonText>
                        </Button>
                    </HStack>
                </VStack>
            </AlertDialogContent>
        </AlertDialog>
    );
}
