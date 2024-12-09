import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageFormData, messageSchema } from "@/lib/validators";
import { useMessageInput } from "@/hooks/useMessageInput";

export const MessageInput = () => {
  const { handleSubmit, emitTyping, inputRef, loading } = useMessageInput();
  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="border-t p-4 flex gap-2 bg-card"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Type a message..."
                  onKeyDown={emitTyping}
                  {...field}
                  ref={inputRef}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" variant="default">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </Form>
  );
};
