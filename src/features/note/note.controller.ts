import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { Message } from 'src/core/decorators';
import { NoteService } from './note.service';
import { AccessTokenGuard } from 'src/core/guards';
import { ApiTags } from '@nestjs/swagger';
import { CreateNotepadDto } from './dto/create-notepad.dto';
import { NoteDocument } from './note.schema';
import { Request } from 'express';

@Controller('notes')
@ApiTags('Notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('create')
  @Message('Sucessfully created note')
  @UseGuards(AccessTokenGuard)
  public async createNote(
    @Body() createNotepadDto: CreateNotepadDto,
    @Req() req: Request,
  ): Promise<NoteDocument> {
    const currentUsername = req.user['username'];
    return this.noteService.create(createNotepadDto, currentUsername);
  }
}
